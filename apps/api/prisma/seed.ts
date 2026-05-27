/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/no-process-exit */
import { fakerKO as faker } from '@faker-js/faker';
import {
  type Admin,
  AdminActionType,
  AuthProvider,
  BusinessSector,
  CommunityCategory,
  CsChatStatus,
  type ExpertProfile,
  type Service,
  MainSectionType,
  MainTargetType,
  MessageType,
  NotificationCategory,
  NotificationType,
  OrderStatus,
  PaymentStatus,
  type Portfolio,
  PrismaClient,
  ReferenceType,
  RefundStatus,
  RefundType,
  Region,
  ReportReason,
  ReportStatus,
  Role,
  SenderType,
  ServiceCategoryName,
  ServiceGroupName,
  ServiceStatus,
  StackType,
  TechStackName,
  type User,
} from '@prisma/client';
import bcrypt from 'bcrypt';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });

// ─── 상수 ───────────────────────────────────────────────────────────────
const SEED_PASSWORD = 'test1234';

const SAMPLE_IMAGES = [
  'https://picsum.photos/seed/moveit-1/800/1200',
  'https://picsum.photos/seed/moveit-2/800/1200',
  'https://picsum.photos/seed/moveit-3/800/1200',
  'https://picsum.photos/seed/moveit-4/800/1200',
  'https://picsum.photos/seed/moveit-5/800/1200',
  'https://picsum.photos/seed/moveit-6/800/1200',
  'https://picsum.photos/seed/moveit-7/800/1200',
  'https://picsum.photos/seed/moveit-8/800/1200',
  'https://picsum.photos/seed/moveit-9/800/1200',
  'https://picsum.photos/seed/moveit-10/800/1200',
];

const PROFILE_IMAGES = [
  'https://picsum.photos/seed/profile-1/400/400',
  'https://picsum.photos/seed/profile-2/400/400',
  'https://picsum.photos/seed/profile-3/400/400',
  'https://picsum.photos/seed/profile-4/400/400',
  'https://picsum.photos/seed/profile-5/400/400',
  'https://picsum.photos/seed/profile-6/400/400',
  'https://picsum.photos/seed/profile-7/400/400',
  'https://picsum.photos/seed/profile-8/400/400',
  'https://picsum.photos/seed/profile-9/400/400',
  'https://picsum.photos/seed/profile-10/400/400',
];

const BANNER_IMAGES = [
  'https://picsum.photos/seed/banner-1/1920/600',
  'https://picsum.photos/seed/banner-2/1920/600',
  'https://picsum.photos/seed/banner-3/1920/600',
];

const REPORT_REASONS: ReportReason[] = [
  ReportReason.FALSE_INFORMATION,
  ReportReason.ABUSE,
  ReportReason.ILLEGAL_ACTIVITY,
  ReportReason.EXTERNAL_CONTACT,
  ReportReason.SPAM,
  ReportReason.OTHER,
];

const COMMENT_TEMPLATES = [
  '잘 봤습니다! 도움이 많이 됐어요.',
  '저도 비슷한 경험이 있었어요.',
  '이 부분 더 자세히 알려주실 수 있을까요?',
  '감사합니다 :)',
  '좋은 정보 공유해주셔서 감사해요!',
  '저도 추천드립니다.',
  '관련 자료가 있다면 공유해주세요.',
  '실제로 적용해봤는데 효과가 좋았어요.',
];

// ─── helpers ────────────────────────────────────────────────────────────
const pick = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]!;
const rand = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = <T>(arr: readonly T[]): T[] =>
  [...arr].sort(() => Math.random() - 0.5);
const pickImage = (): string => pick(SAMPLE_IMAGES);
const pickProfileImage = (): string => pick(PROFILE_IMAGES);
const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

// ─── Seeder ─────────────────────────────────────────────────────────────
class Seeder {
  readonly #prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.#prisma = prisma;
  }

  async run(): Promise<void> {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('⚠️ 프로덕션 환경에서는 시딩을 실행하지 않습니다.');
    }

    console.warn('🌱 시딩 시작...');

    const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

    await this.#resetDb();
    console.warn('✅ 기존 데이터 삭제 완료');

    const { techStacks, serviceGroups, serviceCategories } =
      await this.#seedCatalogs();
    console.warn(
      `✅ 카탈로그 생성 — TechStack ${techStacks.length.toString()}, ServiceGroup ${serviceGroups.length.toString()}, ServiceCategory ${serviceCategories.length.toString()}`,
    );

    const { superAdmin, staffAdmins } = await this.#seedAdmins(passwordHash);
    const inactiveCount = staffAdmins.filter(
      (a) => a.lastLoginAt === null,
    ).length;
    console.warn(
      `✅ 어드민 — 최고관리자 1, 직원 ${staffAdmins.length.toString()} (미로그인 ${inactiveCount.toString()})`,
    );

    const { clients, experts } = await this.#seedUsers(passwordHash);
    console.warn(
      `✅ 유저 — CLIENT ${clients.length.toString()}, EXPERT ${experts.length.toString()}`,
    );

    const expertProfiles = await this.#seedExpertProfiles(
      experts,
      techStacks,
      serviceGroups,
      serviceCategories,
    );
    console.warn(
      `✅ 전문가 프로필/카테고리/기술스택 ${expertProfiles.length.toString()}개`,
    );

    await this.#seedClientProfiles(clients, serviceGroups, serviceCategories);
    console.warn(`✅ 클라이언트 프로필 ${clients.length.toString()}개`);

    const portfolios = await this.#seedPortfolios(expertProfiles);
    console.warn(
      `✅ 포트폴리오 ${portfolios.length.toString()}개 (이미지/스킬 포함)`,
    );

    const services = await this.#seedServices(
      experts,
      expertProfiles,
      techStacks,
      serviceGroups,
      serviceCategories,
    );
    console.warn(
      `✅ 서비스 ${services.length.toString()}개 (이미지/스텝/FAQ 포함)`,
    );

    await this.#seedOrdersAndPayments(clients, services, superAdmin);
    console.warn(`✅ 주문/결제/리뷰/환불`);

    await this.#updateExpertRatings(experts);
    console.warn(`✅ 전문가 평점/리뷰수 집계 갱신`);

    await this.#seedFavorites(clients, experts, services);
    console.warn(`✅ 즐겨찾기`);

    await this.#seedRecentlyViewedServices(clients, services);
    console.warn(`✅ 최근 본 서비스 (CLIENT 전용)`);

    await this.#seedReports(clients, experts);
    console.warn(`✅ 신고 30건 (PENDING 15 / COMPLETED 15)`);

    await this.#seedCommunity(clients, experts, superAdmin);
    console.warn(`✅ 게시판 10개 (댓글/좋아요 포함)`);

    await this.#seedChatRooms(clients, experts, services);
    console.warn(`✅ 1:1 채팅 5방`);

    await this.#seedCsChatRooms(clients, superAdmin);
    console.warn(`✅ CS 채팅 25방 (OPEN 12 / ASSIGNED 8 / CLOSED 5)`);

    await this.#seedNotifications(clients, experts);
    console.warn(`✅ 알림 10개`);

    await this.#seedBanners();
    await this.#seedMainSettings(experts, services);
    await this.#seedFaqs();
    await this.#seedStatistics(experts, serviceGroups, serviceCategories);
    await this.#seedCategoryFeaturedServices(serviceGroups, services);
    await this.#seedAdminActivityLogs([superAdmin, ...staffAdmins]);
    console.warn(`✅ 배너/메인설정/FAQ/통계/카테고리추천/어드민로그`);

    console.warn('\n────────────────────────────');
    console.warn(`🔑 테스트 계정 (공통 비밀번호: ${SEED_PASSWORD})`);
    console.warn(`   admin@moveit.com         (ADMIN)`);
    console.warn(`   client1~20@moveit.com    (CLIENT)`);
    console.warn(`   expert1~20@moveit.com    (EXPERT, expert1~8 신청 대기)`);
    console.warn('────────────────────────────');
    console.warn('✅ 시딩 완료');
  }

  // ─── 1. Reset ─────────────────────────────────────────────────────────
  async #resetDb(): Promise<void> {
    // 외래키 의존성 역순으로 삭제
    await this.#prisma.adminActivityLog.deleteMany();
    await this.#prisma.categoryFeaturedService.deleteMany();
    await this.#prisma.notification.deleteMany();
    await this.#prisma.mainSetting.deleteMany();
    await this.#prisma.banner.deleteMany();
    await this.#prisma.faq.deleteMany();
    await this.#prisma.statisticsByCategory.deleteMany();
    await this.#prisma.statisticsBySeller.deleteMany();
    await this.#prisma.csMessageAttachment.deleteMany();
    await this.#prisma.csChatRoom.updateMany({ data: { lastMessageId: null } });
    await this.#prisma.csMessage.deleteMany();
    await this.#prisma.csChatRoom.deleteMany();
    await this.#prisma.messageAttachment.deleteMany();
    await this.#prisma.chatRoom.updateMany({ data: { lastMessageId: null } });
    await this.#prisma.chatParticipant.deleteMany();
    await this.#prisma.message.deleteMany();
    await this.#prisma.chatRoom.deleteMany();
    await this.#prisma.like.deleteMany();
    await this.#prisma.comment.deleteMany();
    await this.#prisma.communityPost.deleteMany();
    await this.#prisma.reportImage.deleteMany();
    await this.#prisma.report.deleteMany();
    await this.#prisma.favoriteService.deleteMany();
    await this.#prisma.favoriteExpert.deleteMany();
    await this.#prisma.recentlyViewedService.deleteMany();
    await this.#prisma.review.deleteMany();
    await this.#prisma.refund.deleteMany();
    await this.#prisma.payment.deleteMany();
    await this.#prisma.order.deleteMany();
    await this.#prisma.serviceFaq.deleteMany();
    await this.#prisma.serviceStep.deleteMany();
    await this.#prisma.serviceImage.deleteMany();
    await this.#prisma.serviceTechStack.deleteMany();
    await this.#prisma.service.deleteMany();
    await this.#prisma.portfolioSkill.deleteMany();
    await this.#prisma.portfolioImage.deleteMany();
    await this.#prisma.portfolio.deleteMany();
    await this.#prisma.expertTechStack.deleteMany();
    await this.#prisma.expertSpecialtyCategory.deleteMany();
    await this.#prisma.clientInterestCategory.deleteMany();
    await this.#prisma.expertProfile.deleteMany();
    await this.#prisma.clientProfile.deleteMany();
    await this.#prisma.serviceCategory.deleteMany();
    await this.#prisma.serviceGroup.deleteMany();
    await this.#prisma.techStack.deleteMany();
    await this.#prisma.admin.deleteMany();
    await this.#prisma.user.deleteMany();
  }

  // ─── 2. 카탈로그 ──────────────────────────────────────────────────────
  async #seedCatalogs(): Promise<{
    techStacks: { id: string; name: TechStackName }[];
    serviceGroups: { id: string; name: ServiceGroupName }[];
    serviceCategories: { id: string; name: ServiceCategoryName }[];
  }> {
    const techStackNames = Object.values(TechStackName);
    const techStacks = await Promise.all(
      techStackNames.map((name) =>
        this.#prisma.techStack.create({
          data: { name },
          select: { id: true, name: true },
        }),
      ),
    );

    const serviceGroupNames = Object.values(ServiceGroupName);
    const serviceGroups = await Promise.all(
      serviceGroupNames.map((name) =>
        this.#prisma.serviceGroup.create({
          data: { name },
          select: { id: true, name: true },
        }),
      ),
    );

    const serviceCategoryNames = Object.values(ServiceCategoryName);
    const serviceCategories = await Promise.all(
      serviceCategoryNames.map((name) =>
        this.#prisma.serviceCategory.create({
          data: { name },
          select: { id: true, name: true },
        }),
      ),
    );

    return { techStacks, serviceGroups, serviceCategories };
  }

  // ─── 3. Admin ─────────────────────────────────────────────────────────
  async #seedAdmins(
    passwordHash: string,
  ): Promise<{ superAdmin: Admin; staffAdmins: Admin[] }> {
    // 최고 관리자 1명
    const superAdmin = await this.#prisma.admin.create({
      data: {
        email: 'admin@moveit.com',
        password: passwordHash,
        name: '무빗 최고관리자',
        isSuper: true,
        mustChangePassword: false,
        lastLoginAt: new Date(),
      },
    });

    // 직원 5명 (그 중 2명은 한 번도 로그인 안 한 상태 — 임시 비번 미변경)
    const staffAdmins = await Promise.all(
      range(5).map((i) => {
        const hasLoggedIn = i < 3; // 앞 3명은 로그인 + 비번 변경 완료, 뒤 2명은 신규
        return this.#prisma.admin.create({
          data: {
            email: `staff${(i + 1).toString()}@moveit.com`,
            password: passwordHash,
            name: `무빗 직원${(i + 1).toString()}`,
            isSuper: false,
            mustChangePassword: !hasLoggedIn,
            lastLoginAt: hasLoggedIn ? faker.date.recent({ days: 30 }) : null,
          },
        });
      }),
    );

    return { superAdmin, staffAdmins };
  }

  // ─── 4. Users ─────────────────────────────────────────────────────────
  async #seedUsers(
    passwordHash: string,
  ): Promise<{ clients: User[]; experts: User[] }> {
    const regions = Object.values(Region);

    const clients = await Promise.all(
      range(20).map((i) =>
        this.#prisma.user.create({
          data: {
            email: `client${(i + 1).toString()}@moveit.com`,
            name: `클라이언트${(i + 1).toString()}`,
            password: passwordHash,
            provider: AuthProvider.LOCAL,
            role: Role.CLIENT,
            profileImageUrl: pickProfileImage(),
            region: pick(regions),
            phoneNumber: faker.phone.number(),
          },
        }),
      ),
    );

    const experts = await Promise.all(
      range(20).map((i) =>
        this.#prisma.user.create({
          data: {
            email: `expert${(i + 1).toString()}@moveit.com`,
            name: `전문가${(i + 1).toString()}`,
            password: passwordHash,
            provider: AuthProvider.LOCAL,
            role: Role.EXPERT,
            profileImageUrl: pickProfileImage(),
            region: pick(regions),
            phoneNumber: faker.phone.number(),
            bankName: pick(['국민', '신한', '우리', '하나', '카카오뱅크']),
            bankAccount: faker.finance.accountNumber(),
          },
        }),
      ),
    );

    return { clients, experts };
  }

  // ─── 5. ExpertProfile + 매핑 ──────────────────────────────────────────
  async #seedExpertProfiles(
    experts: User[],
    techStacks: { id: string; name: TechStackName }[],
    serviceGroups: { id: string; name: ServiceGroupName }[],
    serviceCategories: { id: string; name: ServiceCategoryName }[],
  ): Promise<ExpertProfile[]> {
    const profiles: ExpertProfile[] = [];

    // 앞 8명은 isApplied=true, isApproved=false (신청 대기) — 대시보드 카드용
    // 나머지는 isApplied=true, isApproved=true (승인 완료)
    const PENDING_COUNT = 8;

    for (const [index, expert] of experts.entries()) {
      const isPending = index < PENDING_COUNT;
      const profile = await this.#prisma.expertProfile.create({
        data: {
          userId: expert.id,
          isApplied: true,
          isApproved: !isPending,
          approvedAt: isPending ? null : faker.date.recent({ days: 60 }),
          businessName: faker.company.name(),
          businessNumber: faker.string.numeric(10),
          ceoName: expert.name ?? faker.person.fullName(),
          contactTimeStart: '10:00',
          contactTimeEnd: '19:00',
          foundedYear: rand(2010, 2024),
          employeeMin: rand(1, 10),
          employeeMax: rand(11, 50),
          description: faker.lorem.paragraphs(2),
        },
      });
      profiles.push(profile);

      // 전문 카테고리 (각 EXPERT마다 2개 매핑)
      const pickedGroups = shuffle(serviceGroups).slice(0, 2);
      const pickedCategories = shuffle(serviceCategories).slice(0, 2);
      for (let i = 0; i < 2; i++) {
        await this.#prisma.expertSpecialtyCategory.create({
          data: {
            expertProfileId: profile.id,
            serviceGroupId: pickedGroups[i]!.id,
            serviceCategoryId: pickedCategories[i]!.id,
          },
        });
      }

      // 기술 스택 (각 EXPERT마다 3~5개)
      const pickedTechs = shuffle(techStacks).slice(0, rand(3, 5));
      for (const tech of pickedTechs) {
        await this.#prisma.expertTechStack.create({
          data: { expertProfileId: profile.id, techStackId: tech.id },
        });
      }
    }

    return profiles;
  }

  // ─── 6. ClientProfile + 관심 카테고리 ─────────────────────────────────
  async #seedClientProfiles(
    clients: User[],
    serviceGroups: { id: string; name: ServiceGroupName }[],
    serviceCategories: { id: string; name: ServiceCategoryName }[],
  ): Promise<void> {
    for (const client of clients) {
      const profile = await this.#prisma.clientProfile.create({
        data: {
          userId: client.id,
          nickname: faker.internet.username(),
        },
      });

      // 관심 카테고리 1~2개
      const pickedGroups = shuffle(serviceGroups).slice(0, rand(1, 2));
      const pickedCategories = shuffle(serviceCategories).slice(
        0,
        pickedGroups.length,
      );
      for (const [i, pickedGroup] of pickedGroups.entries()) {
        await this.#prisma.clientInterestCategory.create({
          data: {
            clientProfileId: profile.id,
            serviceGroupId: pickedGroup.id,
            serviceCategoryId: pickedCategories[i]!.id,
          },
        });
      }
    }
  }

  // ─── 7. Portfolio + 이미지 + 스킬 ─────────────────────────────────────
  async #seedPortfolios(expertProfiles: ExpertProfile[]): Promise<Portfolio[]> {
    const portfolios: Portfolio[] = [];
    const businessSectors = Object.values(BusinessSector);
    const stackTypes = Object.values(StackType);

    for (const profile of expertProfiles) {
      const count = rand(1, 2);
      for (let i = 0; i < count; i++) {
        const portfolio = await this.#prisma.portfolio.create({
          data: {
            expertProfileId: profile.id,
            title: faker.commerce.productName(),
            description: faker.lorem.paragraphs(3),
            clientName: faker.company.name(),
            businessSector: pick(businessSectors),
          },
        });
        portfolios.push(portfolio);

        // 이미지 1~10장 (썸네일 1 + 상세 0~9)
        const imageCount = rand(2, 10);
        await this.#prisma.portfolioImage.createMany({
          data: range(imageCount).map((idx) => ({
            portfolioId: portfolio.id,
            imgUrl: pickImage(),
            isMain: idx === 0,
          })),
        });

        // 스킬 2~4개
        const skillCount = rand(2, 4);
        await this.#prisma.portfolioSkill.createMany({
          data: range(skillCount).map(() => ({
            portfolioId: portfolio.id,
            stackName: pick(Object.values(TechStackName)),
            stackType: pick(stackTypes),
          })),
        });
      }
    }

    return portfolios;
  }

  // ─── 8. Service + TechStack + 이미지 + 스텝 + FAQ ─────────────────────
  async #seedServices(
    experts: User[],
    expertProfiles: ExpertProfile[],
    techStacks: { id: string; name: TechStackName }[],
    serviceGroups: { id: string; name: ServiceGroupName }[],
    serviceCategories: { id: string; name: ServiceCategoryName }[],
  ): Promise<Service[]> {
    const services: Service[] = [];
    const statuses = Object.values(ServiceStatus);

    for (const expert of experts) {
      const profile = expertProfiles.find((p) => p.userId === expert.id);
      if (!profile) continue;
      // 미승인(신청 대기) 전문가는 서비스 생성 안 함 — 승인 후에야 서비스 등록 가능
      if (!profile.isApproved) continue;

      const count = rand(1, 2);
      for (let i = 0; i < count; i++) {
        const service = await this.#prisma.service.create({
          data: {
            expertUserId: expert.id,
            title: faker.commerce.productName(),
            workDuration: rand(7, 60),
            revisionCount: rand(1, 5),
            serviceScope: faker.lorem.sentence(),
            servicePrice: rand(500_000, 5_000_000),
            description: faker.lorem.paragraphs(3),
            preparationNotes:
              '작업 시작 전 기획서와 참고 자료를 준비해 주세요.',
            refundPolicy:
              '작업 시작 전 100% 환불, 작업 중 50% 환불, 작업 완료 후 환불 불가',
            status: pick(statuses),
            serviceGroupId: pick(serviceGroups).id,
            serviceCategoryId: pick(serviceCategories).id,
          },
        });
        services.push(service);

        // 기술 스택 (서비스마다 2~4개)
        const pickedTechs = shuffle(techStacks).slice(0, rand(2, 4));
        await this.#prisma.serviceTechStack.createMany({
          data: pickedTechs.map((tech) => ({
            serviceId: service.id,
            techStackId: tech.id,
          })),
        });

        // 이미지 (썸네일 1 + 상세 2~5)
        const imageCount = rand(3, 6);
        await this.#prisma.serviceImage.createMany({
          data: range(imageCount).map((idx) => ({
            serviceId: service.id,
            imgUrl: pickImage(),
            isMain: idx === 0,
          })),
        });

        // 스텝 3개
        const steps = ['요구사항 분석', '디자인/기획', '개발 및 검수'];
        for (const [s, step] of steps.entries()) {
          await this.#prisma.serviceStep.create({
            data: {
              serviceId: service.id,
              title: step,
              description: faker.lorem.sentence(),
              order: s + 1,
            },
          });
        }

        // FAQ 3개
        await this.#prisma.serviceFaq.createMany({
          data: range(3).map(() => ({
            serviceId: service.id,
            question: `${faker.lorem.sentence()}?`,
            answer: faker.lorem.paragraph(),
          })),
        });
      }
    }

    return services;
  }

  // ─── 9. Order + Payment + Review + Refund ─────────────────────────────
  async #seedOrdersAndPayments(
    clients: User[],
    services: Service[],
    admin: Admin,
  ): Promise<void> {
    // 상태별 분포 — 대시보드 카드 카운트 검증용
    // 서비스 진행중(NEG+IP+DL+WC) = 8+12+6+6 = 32, 정산 요청 = 12
    const orderStatusPlan: OrderStatus[] = [
      ...Array<OrderStatus>(8).fill(OrderStatus.NEGOTIATING),
      ...Array<OrderStatus>(12).fill(OrderStatus.IN_PROGRESS),
      ...Array<OrderStatus>(6).fill(OrderStatus.DEADLINE_IMMINENT),
      ...Array<OrderStatus>(6).fill(OrderStatus.WORK_COMPLETED),
      ...Array<OrderStatus>(5).fill(OrderStatus.PURCHASE_CONFIRMED),
      ...Array<OrderStatus>(12).fill(OrderStatus.SETTLEMENT_REQUESTED),
      ...Array<OrderStatus>(6).fill(OrderStatus.SETTLEMENT_COMPLETED),
      ...Array<OrderStatus>(5).fill(OrderStatus.REFUND_REQUESTED),
    ];

    for (let i = 0; i < orderStatusPlan.length; i++) {
      const client = pick(clients);
      const service = pick(services);
      const status = orderStatusPlan[i]!;
      const isConfirmed =
        status === OrderStatus.PURCHASE_CONFIRMED ||
        status === OrderStatus.SETTLEMENT_REQUESTED ||
        status === OrderStatus.SETTLEMENT_COMPLETED;

      const isSettled = status === OrderStatus.SETTLEMENT_COMPLETED;
      const platformFee = Math.floor(service.servicePrice * 0.1);
      const order = await this.#prisma.order.create({
        data: {
          clientUserId: client.id,
          expertUserId: service.expertUserId,
          serviceId: service.id,
          agreedServicePrice: service.servicePrice,
          platformFee,
          totalAmount: service.servicePrice + platformFee,
          status,
          startDate: faker.date.recent({ days: 30 }),
          endDate: faker.date.soon({ days: 30 }),
          confirmedAt: isConfirmed ? faker.date.recent({ days: 30 }) : null,
          settledAt: isSettled ? faker.date.recent({ days: 10 }) : null,
          settledByAdminId: isSettled ? admin.id : null,
        },
      });

      const payment = await this.#prisma.payment.create({
        data: {
          orderId: order.id,
          clientUserId: client.id,
          paidAmount: order.totalAmount,
          status: PaymentStatus.PAID,
          method: pick(['카드', '계좌이체', '간편결제']),
          paymentKey: faker.string.uuid(),
          rawData: { provider: 'toss', mock: true },
          approvedAt: new Date(),
        },
      });

      // 구매확정 이후 단계는 리뷰 작성 가능
      if (
        status === OrderStatus.PURCHASE_CONFIRMED ||
        status === OrderStatus.SETTLEMENT_REQUESTED ||
        status === OrderStatus.SETTLEMENT_COMPLETED
      ) {
        await this.#prisma.review.create({
          data: {
            orderId: order.id,
            userId: client.id,
            rating: rand(3, 5),
            content: faker.lorem.paragraph(),
          },
        });
      }

      // 환불 요청 건은 Refund 추가
      if (status === OrderStatus.REFUND_REQUESTED) {
        await this.#prisma.refund.create({
          data: {
            paymentId: payment.id,
            clientUserId: client.id,
            expertUserId: service.expertUserId,
            refundAmount: order.totalAmount,
            type: RefundType.CANCEL,
            status: RefundStatus.REQUESTED,
            adminReason: '서비스 진행 어려움',
            approvedAdminId: admin.id,
            requestedAt: new Date(),
            paymentKey: payment.paymentKey,
            rawData: { provider: 'toss', mock: true },
          },
        });
      }
    }
  }

  // ─── 9-2. Expert 평점/리뷰수 집계 ─────────────────────────────────────
  async #updateExpertRatings(experts: User[]): Promise<void> {
    for (const expert of experts) {
      const reviews = await this.#prisma.review.findMany({
        where: { order: { expertUserId: expert.id } },
        select: { rating: true },
      });
      if (reviews.length === 0) continue;

      const avgRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      await this.#prisma.expertProfile.update({
        where: { userId: expert.id },
        data: {
          avgRating,
          reviewCount: reviews.length,
        },
      });
    }
  }

  // ─── 10. Favorites ────────────────────────────────────────────────────
  async #seedFavorites(
    clients: User[],
    experts: User[],
    services: Service[],
  ): Promise<void> {
    const pairs = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const client = pick(clients);
      const service = pick(services);
      const key = `${client.id}-${service.id}`;
      if (pairs.has(key)) continue;
      pairs.add(key);
      await this.#prisma.favoriteService.create({
        data: { clientUserId: client.id, serviceId: service.id },
      });
    }

    const expertPairs = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const client = pick(clients);
      const expert = pick(experts);
      const key = `${client.id}-${expert.id}`;
      if (expertPairs.has(key)) continue;
      expertPairs.add(key);
      await this.#prisma.favoriteExpert.create({
        data: { clientUserId: client.id, expertUserId: expert.id },
      });
    }
  }

  // ─── 10-2. Recently Viewed Services (CLIENT 전용) ─────────────────────
  async #seedRecentlyViewedServices(
    clients: User[],
    services: Service[],
  ): Promise<void> {
    const pairs = new Set<string>();
    for (let i = 0; i < 30; i++) {
      const client = pick(clients);
      const service = pick(services);
      const key = `${client.id}-${service.id}`;
      if (pairs.has(key)) continue;
      pairs.add(key);
      await this.#prisma.recentlyViewedService.create({
        data: {
          clientUserId: client.id,
          serviceId: service.id,
          viewedAt: faker.date.recent({ days: 14 }),
        },
      });
    }
  }

  // ─── 11. Reports + 증거 이미지 ───────────────────────────────────────
  async #seedReports(clients: User[], experts: User[]): Promise<void> {
    // 30건 — 15 PENDING(처리 대기) + 15 COMPLETED(처리 완료)
    const total = 30;
    const pendingCount = 15;
    for (let i = 0; i < total; i++) {
      const isPending = i < pendingCount;
      const report = await this.#prisma.report.create({
        data: {
          reporterId: pick(clients).id,
          reportedId: pick(experts).id,
          reason: pick(REPORT_REASONS),
          status: isPending ? ReportStatus.PENDING : ReportStatus.COMPLETED,
          detail: faker.lorem.paragraph(),
        },
      });

      // 증거 이미지 1~3장
      const imageCount = rand(1, 3);
      await this.#prisma.reportImage.createMany({
        data: range(imageCount).map(() => ({
          reportsId: report.id,
          imageUrl: pickImage(),
        })),
      });
    }
  }

  // ─── 12. Community ────────────────────────────────────────────────────
  async #seedCommunity(
    clients: User[],
    experts: User[],
    admin: Admin,
  ): Promise<void> {
    const categories = Object.values(CommunityCategory);
    const allUsers = [...clients, ...experts];

    for (let i = 0; i < 10; i++) {
      const author = pick(allUsers);
      const isDeleted = i === 0; // 1개는 삭제된 상태
      const post = await this.#prisma.communityPost.create({
        data: {
          userId: author.id,
          category: pick(categories),
          title: faker.lorem.sentence({ min: 3, max: 8 }),
          content: faker.lorem.paragraphs(rand(2, 5)),
          deletedAt: isDeleted ? new Date() : null,
          deleteReason: isDeleted ? '운영 정책 위반' : null,
          deletedByAdminId: isDeleted ? admin.id : null,
        },
      });

      // 댓글 0~5개
      const commentCount = rand(0, 5);
      for (let c = 0; c < commentCount; c++) {
        await this.#prisma.comment.create({
          data: {
            postId: post.id,
            userId: pick(allUsers).id,
            content: pick(COMMENT_TEMPLATES),
          },
        });
      }

      // 좋아요 0~8명
      const likers = shuffle(allUsers).slice(0, rand(0, 8));
      if (likers.length > 0) {
        await this.#prisma.like.createMany({
          data: likers.map((u) => ({ postId: post.id, userId: u.id })),
          skipDuplicates: true,
        });
      }
    }
  }

  // ─── 13. 1:1 채팅 ──────────────────────────────────────────────────────
  async #seedChatRooms(
    clients: User[],
    experts: User[],
    services: Service[],
  ): Promise<void> {
    const pairs = new Set<string>();
    let created = 0;
    let safety = 0;

    while (created < 5 && safety < 100) {
      safety++;
      const client = pick(clients);
      const expert = pick(experts);

      const service = services.find((s) => s.expertUserId === expert.id);
      if (!service) continue;

      const key = `${client.id}-${expert.id}-${service.id}`;
      if (pairs.has(key)) continue;
      pairs.add(key);

      const room = await this.#prisma.chatRoom.create({
        data: {
          clientUserId: client.id,
          expertUserId: expert.id,
          currentServiceId: service.id,
        },
      });

      await this.#prisma.chatParticipant.createMany({
        data: [
          { chatRoomId: room.id, userId: client.id },
          { chatRoomId: room.id, userId: expert.id },
        ],
      });

      // 메시지 5~10개
      const messageCount = rand(5, 10);
      let lastMessageId: string | null = null;
      for (let m = 0; m < messageCount; m++) {
        const sender = m % 2 === 0 ? client : expert;
        const useFile = m === messageCount - 1; // 마지막 한 개는 첨부파일
        const message = await this.#prisma.message.create({
          data: {
            chatRoomId: room.id,
            senderId: sender.id,
            type: useFile ? MessageType.FILE : MessageType.TEXT,
            content: useFile ? '파일을 보냈습니다.' : faker.lorem.sentence(),
          },
        });
        lastMessageId = message.id;

        if (useFile) {
          await this.#prisma.messageAttachment.create({
            data: {
              messageId: message.id,
              fileUrl: pickImage(),
              fileName: `attachment-${(m + 1).toString()}.jpg`,
              fileType: 'image/jpeg',
              fileSize: rand(100_000, 2_000_000),
            },
          });
        }
      }

      await this.#prisma.chatRoom.update({
        where: { id: room.id },
        data: { lastMessageId },
      });
      created++;
    }
  }

  // ─── 14. CS 채팅 ──────────────────────────────────────────────────────
  async #seedCsChatRooms(clients: User[], admin: Admin): Promise<void> {
    // 25건 — 12 OPEN(처리 대기) + 8 ASSIGNED + 5 CLOSED
    const statusPlan: CsChatStatus[] = [
      ...Array<CsChatStatus>(12).fill(CsChatStatus.OPEN),
      ...Array<CsChatStatus>(8).fill(CsChatStatus.ASSIGNED),
      ...Array<CsChatStatus>(5).fill(CsChatStatus.CLOSED),
    ];

    for (let i = 0; i < statusPlan.length; i++) {
      const client = pick(clients);
      const status = statusPlan[i]!;
      const room = await this.#prisma.csChatRoom.create({
        data: {
          userId: client.id,
          assignedAdminId:
            status === CsChatStatus.ASSIGNED || status === CsChatStatus.CLOSED
              ? admin.id
              : null,
          status,
        },
      });

      // 메시지 3~6개
      const messageCount = rand(3, 6);
      let lastMessageId: string | null = null;
      for (let m = 0; m < messageCount; m++) {
        const fromUser = m % 2 === 0;
        const message = await this.#prisma.csMessage.create({
          data: {
            chatRoomId: room.id,
            senderType: fromUser ? SenderType.USER : SenderType.ADMIN,
            senderUserId: fromUser ? client.id : null,
            senderAdminId: fromUser ? null : admin.id,
            content: faker.lorem.sentence(),
            type: MessageType.TEXT,
          },
        });
        lastMessageId = message.id;
      }

      await this.#prisma.csChatRoom.update({
        where: { id: room.id },
        data: { lastMessageId },
      });
    }
  }

  // ─── 15. Notifications ────────────────────────────────────────────────
  async #seedNotifications(clients: User[], experts: User[]): Promise<void> {
    const allUsers = [...clients, ...experts];
    const types = Object.values(NotificationType);
    const categories = Object.values(NotificationCategory);
    const referenceTypes = Object.values(ReferenceType);

    await this.#prisma.notification.createMany({
      data: range(10).map(() => ({
        userId: pick(allUsers).id,
        type: pick(types),
        category: pick(categories),
        content: faker.lorem.sentence(),
        referenceType: pick(referenceTypes),
        referenceId: faker.string.uuid(),
        isRead: Math.random() < 0.3,
      })),
    });
  }

  // ─── 16. Banners ──────────────────────────────────────────────────────
  async #seedBanners(): Promise<void> {
    await this.#prisma.banner.createMany({
      data: BANNER_IMAGES.map((imageUrl, i) => ({
        imageUrl,
        actionUrl: `https://moveit.local/promo/${(i + 1).toString()}`,
      })),
    });
  }

  // ─── 17. MainSettings ─────────────────────────────────────────────────
  async #seedMainSettings(experts: User[], services: Service[]): Promise<void> {
    const sectionTypes = Object.values(MainSectionType);

    for (const sectionType of sectionTypes) {
      const targetType = sectionType.includes('EXPERT')
        ? MainTargetType.USER
        : MainTargetType.SERVICE;
      await this.#prisma.mainSetting.create({
        data: {
          sectionType,
          targetType,
          targetUserId:
            targetType === MainTargetType.USER ? pick(experts).id : null,
          targetServiceId:
            targetType === MainTargetType.SERVICE ? pick(services).id : null,
        },
      });
    }
  }

  // ─── 18. FAQs ─────────────────────────────────────────────────────────
  async #seedFaqs(): Promise<void> {
    const faqs = [
      {
        title: '서비스 이용 방법이 궁금해요',
        content: '회원가입 후 원하는 서비스를 검색해서 신청하시면 됩니다.',
      },
      {
        title: '결제는 어떻게 진행되나요?',
        content: '카드, 계좌이체, 간편결제를 지원합니다.',
      },
      {
        title: '환불 규정이 어떻게 되나요?',
        content: '서비스별 환불 정책을 참고해주세요.',
      },
      {
        title: '전문가로 활동하고 싶어요',
        content: '전문가 등록 페이지에서 신청 가능합니다.',
      },
      {
        title: '문의는 어디로 하나요?',
        content: 'CS 채팅으로 언제든 문의해주세요.',
      },
    ];
    await this.#prisma.faq.createMany({ data: faqs });
  }

  // ─── 19. Statistics ───────────────────────────────────────────────────
  async #seedStatistics(
    experts: User[],
    serviceGroups: { id: string; name: ServiceGroupName }[],
    serviceCategories: { id: string; name: ServiceCategoryName }[],
  ): Promise<void> {
    // 최근 7일치 일별 통계
    const statsDates = range(7).map((daysAgo) => {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - daysAgo);
      d.setUTCHours(0, 0, 0, 0);
      return d;
    });

    for (const expert of experts) {
      for (const date of statsDates) {
        await this.#prisma.statisticsBySeller.create({
          data: {
            sellerUserId: expert.id,
            date,
            totalTransactionAmount: rand(1_000_000, 50_000_000),
            totalTransactionCount: rand(1, 30),
            maxTransactionAmount: rand(500_000, 5_000_000),
          },
        });
      }
    }

    for (const group of serviceGroups) {
      for (const category of serviceCategories) {
        for (const date of statsDates) {
          await this.#prisma.statisticsByCategory.create({
            data: {
              serviceGroupId: group.id,
              serviceCategoryId: category.id,
              date,
              totalTransactionAmount: rand(1_000_000, 100_000_000),
              totalTransactionCount: rand(1, 100),
              maxTransactionAmount: rand(500_000, 10_000_000),
            },
          });
        }
      }
    }
  }

  // ─── 20. CategoryFeaturedServices (그룹별 추천 서비스) ─────────────
  async #seedCategoryFeaturedServices(
    serviceGroups: { id: string; name: ServiceGroupName }[],
    services: Service[],
  ): Promise<void> {
    for (const group of serviceGroups) {
      const groupServices = services.filter(
        (s) => s.serviceGroupId === group.id,
      );
      const picked = shuffle(groupServices).slice(
        0,
        Math.min(3, groupServices.length),
      );
      for (const service of picked) {
        await this.#prisma.categoryFeaturedService.create({
          data: {
            serviceGroupId: group.id,
            serviceId: service.id,
          },
        });
      }
    }
  }

  // ─── 21. AdminActivityLogs ─────────────────────────────────────────
  async #seedAdminActivityLogs(admins: Admin[]): Promise<void> {
    // 실제로 가리킬 수 있는 id 후보 미리 조회 → enrich 시 매칭되도록
    const [users, faqs] = await Promise.all([
      this.#prisma.user.findMany({ select: { id: true } }),
      this.#prisma.faq.findMany({ select: { id: true } }),
    ]);

    const USER_ACTIONS = new Set<AdminActionType>([
      AdminActionType.EXPERT_APPROVED,
      AdminActionType.EXPERT_REJECTED,
      AdminActionType.BLACKLIST_ADDED,
      AdminActionType.BLACKLIST_REMOVED,
    ]);
    const FAQ_ACTIONS = new Set<AdminActionType>([
      AdminActionType.FAQ_CREATED,
      AdminActionType.FAQ_UPDATED,
      AdminActionType.FAQ_DELETED,
    ]);

    const pickRefId = (actionType: AdminActionType): string | null => {
      if (USER_ACTIONS.has(actionType)) return pick(users).id;
      if (FAQ_ACTIONS.has(actionType)) return pick(faqs).id;
      return null;
    };

    const actionTypes = Object.values(AdminActionType);
    // 각 actionType 1건씩 (모든 종류 노출 확인용)
    for (const actionType of actionTypes) {
      await this.#prisma.adminActivityLog.create({
        data: {
          adminId: pick(admins).id,
          actionType,
          referenceId: pickRefId(actionType),
          createdAt: faker.date.recent({ days: 30 }),
        },
      });
    }
    // 추가 랜덤 100건 — 무한스크롤 테스트용
    for (let i = 0; i < 100; i++) {
      const actionType = pick(actionTypes);
      await this.#prisma.adminActivityLog.create({
        data: {
          adminId: pick(admins).id,
          actionType,
          referenceId: pickRefId(actionType),
          createdAt: faker.date.recent({ days: 30 }),
        },
      });
    }
  }
}

// ─── Bootstrap ──────────────────────────────────────────────────────────
const prisma = new PrismaClient();
const seeder = new Seeder(prisma);

seeder
  .run()
  .catch((error: unknown) => {
    console.error('❌ 시딩 에러:', error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
