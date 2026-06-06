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
      [superAdmin, ...staffAdmins],
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

    const testServiceId = await this.#seedOrdersApiTestData();
    console.warn(`✅ Orders API 테스트 시드 (주문 10건 + 타인 주문 1건)`);

    await this.#seedAdminUserSubListTestData();
    console.warn(
      `✅ Admin User 하위 리스트 테스트 시드 (test 계정 각 reports/posts/comments 30건씩)`,
    );

    console.warn('\n────────────────────────────');
    console.warn(`🔑 테스트 계정 (공통 비밀번호: ${SEED_PASSWORD})`);
    console.warn(`   admin@moveit.com         (ADMIN)`);
    console.warn(`   client1~20@moveit.com    (CLIENT)`);
    console.warn(
      `   expert1~20@moveit.com    (EXPERT, expert1~4 신청 대기 / expert5~8 거절 / expert9~20 승인)`,
    );
    console.warn('');
    console.warn(`🧪 Orders API 테스트 (비밀번호: Test1234!)`);
    console.warn(`   client@test.com   (CLIENT)`);
    console.warn(`   expert@test.com   (EXPERT, 승인 완료)`);
    console.warn(`   other@test.com    (CLIENT, 403 검증용)`);
    console.warn(`   serviceId         ${testServiceId}`);
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

    const providers = Object.values(AuthProvider);
    // client1·expert1은 LOCAL 고정(이메일 로그인 테스트 보장), 나머지는 4종 provider 랜덤
    const resolveProvider = (i: number): AuthProvider =>
      i === 0 ? AuthProvider.LOCAL : pick(providers);

    const clients = await Promise.all(
      range(20).map((i) => {
        const provider = resolveProvider(i);
        const isLocal = provider === AuthProvider.LOCAL;
        return this.#prisma.user.create({
          data: {
            email: `client${(i + 1).toString()}@moveit.com`,
            name: `클라이언트${(i + 1).toString()}`,
            password: isLocal ? passwordHash : null,
            provider,
            providerId: isLocal ? null : faker.string.numeric(15),
            role: Role.CLIENT,
            profileImageUrl: pickProfileImage(),
            region: pick(regions),
            phoneNumber: faker.phone.number(),
          },
        });
      }),
    );

    const experts = await Promise.all(
      range(20).map((i) => {
        const provider = resolveProvider(i);
        const isLocal = provider === AuthProvider.LOCAL;
        return this.#prisma.user.create({
          data: {
            email: `expert${(i + 1).toString()}@moveit.com`,
            name: `전문가${(i + 1).toString()}`,
            password: isLocal ? passwordHash : null,
            provider,
            providerId: isLocal ? null : faker.string.numeric(15),
            role: Role.EXPERT,
            profileImageUrl: pickProfileImage(),
            region: pick(regions),
            phoneNumber: faker.phone.number(),
            bankName: pick(['국민', '신한', '우리', '하나', '카카오뱅크']),
            bankAccount: faker.finance.accountNumber(),
          },
        });
      }),
    );

    return { clients, experts };
  }

  // ─── 5. ExpertProfile + 매핑 ──────────────────────────────────────────
  async #seedExpertProfiles(
    experts: User[],
    techStacks: { id: string; name: TechStackName }[],
    serviceGroups: { id: string; name: ServiceGroupName }[],
    serviceCategories: { id: string; name: ServiceCategoryName }[],
    admins: Admin[],
  ): Promise<ExpertProfile[]> {
    const profiles: ExpertProfile[] = [];

    // 전문가 상태 분포 (UI 검증용 — 모든 상태 보장)
    // index 0~3 (expert1~4): 신청 대기 (isApplied=true, isApproved=false, rejectedAt=null)
    // index 4~7 (expert5~8): 승인 거절 (isApplied=true, isApproved=false, rejectedAt+rejectReason)
    // index 8~19 (expert9~20): 승인 완료 (isApproved=true)
    const PENDING_COUNT = 4;
    const REJECTED_COUNT = 4;
    const REJECT_REASONS = [
      '사업자등록증 정보가 부족합니다.',
      '제출하신 포트폴리오가 가이드라인에 부합하지 않습니다.',
      '본인 확인이 어려워 거절되었습니다.',
      '회사 정보 검증에 실패했습니다.',
    ];

    for (const [index, expert] of experts.entries()) {
      const isPending = index < PENDING_COUNT;
      const isRejected = !isPending && index < PENDING_COUNT + REJECTED_COUNT;
      const isApproved = !isPending && !isRejected;

      const profile = await this.#prisma.expertProfile.create({
        data: {
          userId: expert.id,
          isApplied: true,
          appliedAt: faker.date.recent({ days: 90 }),
          isApproved,
          approvedAt: isApproved ? faker.date.recent({ days: 60 }) : null,
          approvedByAdminId: isApproved ? pick(admins).id : null,
          rejectedAt: isRejected ? faker.date.recent({ days: 30 }) : null,
          rejectReason: isRejected
            ? (REJECT_REASONS[index - PENDING_COUNT] ?? REJECT_REASONS[0]!)
            : null,
          businessName: faker.company.name(),
          businessNumber: faker.string.numeric(10),
          ceoName: expert.name ?? faker.person.fullName(),
          contactTimeStart: '10:00',
          contactTimeEnd: '19:00',
          foundedYear: rand(2010, 2024) * 100 + rand(1, 12),
          employeeMin: rand(1, 10),
          employeeMax: rand(11, 50),
          description: faker.lorem.paragraphs(2),
        },
      });
      profiles.push(profile);

      // 전문 분야: 그룹 1개 고정 + 그 안에서 카테고리 1~3개 (UI 상한 + MIXED_SERVICE_GROUP 정책 준수)
      const pickedGroup = pick(serviceGroups);
      const pickedCategories = shuffle(serviceCategories).slice(0, rand(2, 3));
      for (const pickedCategory of pickedCategories) {
        await this.#prisma.expertSpecialtyCategory.create({
          data: {
            expertProfileId: profile.id,
            serviceGroupId: pickedGroup.id,
            serviceCategoryId: pickedCategory.id,
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

      // 관심 분야: 그룹 1개 고정 + 그 안에서 카테고리 1~3개 (UI 상한 3 + MIXED_SERVICE_GROUP 정책 준수)
      const pickedGroup = pick(serviceGroups);
      const pickedCategories = shuffle(serviceCategories).slice(0, rand(2, 3));
      for (const pickedCategory of pickedCategories) {
        await this.#prisma.clientInterestCategory.create({
          data: {
            clientProfileId: profile.id,
            serviceGroupId: pickedGroup.id,
            serviceCategoryId: pickedCategory.id,
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

    // UI 테스트용 보장 케이스 — 첫 4명 승인 전문가에 고정 분배
    // (그룹·개수·상태 고정, 세부 카테고리는 랜덤). 5명부터는 기존대로 random.
    const projectGroupId = serviceGroups.find(
      (g) => g.name === ServiceGroupName.PROJECT_REQUEST,
    )?.id;
    const coachingGroupId = serviceGroups.find(
      (g) => g.name === ServiceGroupName.IT_COACHING,
    )?.id;
    if (!projectGroupId || !coachingGroupId) {
      throw new Error(
        '필수 ServiceGroup(IT_COACHING, PROJECT_REQUEST)이 시드 단계에 없습니다',
      );
    }
    const guaranteedPlan = [
      { count: 30, groupId: projectGroupId, status: ServiceStatus.ACTIVE },
      { count: 30, groupId: coachingGroupId, status: ServiceStatus.ACTIVE },
      { count: 10, groupId: projectGroupId, status: ServiceStatus.ACTIVE },
      { count: 10, groupId: coachingGroupId, status: ServiceStatus.ACTIVE },
    ];
    let guaranteedIndex = 0;

    for (const expert of experts) {
      const profile = expertProfiles.find((p) => p.userId === expert.id);
      if (!profile) continue;
      // 미승인(신청 대기) 전문가는 서비스 생성 안 함 — 승인 후에야 서비스 등록 가능
      if (!profile.isApproved) continue;

      const guaranteed = guaranteedPlan[guaranteedIndex];
      if (guaranteed) guaranteedIndex++;
      const count = guaranteed?.count ?? rand(10, 30);

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
            status: guaranteed?.status ?? pick(statuses),
            serviceGroupId: guaranteed?.groupId ?? pick(serviceGroups).id,
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
    // 취소·환불은 Refund 모델로 별도 트래킹 (Order.status는 진행/종결 상태만)
    const orderStatusPlan: OrderStatus[] = [
      ...Array.from({ length: 8 }, () => OrderStatus.NEGOTIATING),
      ...Array.from({ length: 12 }, () => OrderStatus.IN_PROGRESS),
      ...Array.from({ length: 6 }, () => OrderStatus.DEADLINE_IMMINENT),
      ...Array.from({ length: 6 }, () => OrderStatus.WORK_COMPLETED),
      ...Array.from({ length: 5 }, () => OrderStatus.PURCHASE_CONFIRMED),
      ...Array.from({ length: 12 }, () => OrderStatus.SETTLEMENT_REQUESTED),
      ...Array.from({ length: 6 }, () => OrderStatus.SETTLEMENT_COMPLETED),
      // 환불요청 진행 중 (Refund: REFUND/REQUESTED 동반)
      ...Array.from({ length: 2 }, () => OrderStatus.EXPIRED),
      // 취소완료 (Refund: CANCEL/COMPLETED 동반) — 관리자/판매자 승인 50:50 랜덤
      ...Array.from({ length: 4 }, () => OrderStatus.PAYMENT_CANCELLED),
      // 환불완료 (Refund: REFUND/COMPLETED 동반) — 관리자/판매자 승인 50:50 랜덤
      ...Array.from({ length: 4 }, () => OrderStatus.REFUND_COMPLETED),
    ];

    for (const status of orderStatusPlan) {
      const client = pick(clients);
      const service = pick(services);
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
          // 협의 중 단계는 작업 종료일이 아직 안 정해진 상태로 둠
          endDate:
            status === OrderStatus.NEGOTIATING
              ? null
              : faker.date.soon({ days: 30 }),
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
          method: pick([
            '신용카드 롯데',
            '신용카드 신한',
            '신용카드 KB국민',
            '신용카드 삼성',
            '신용카드 현대',
            '신용카드 하나',
          ]),
          installmentMonths: pick([1, 1, 1, 1, 2, 3, 6, 12]),
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

      // 시안 흐름: Order.status별로 Refund row 동반
      // - EXPIRED            → REFUND/REQUESTED (환불요청 진행 중)
      // - PAYMENT_CANCELLED  → CANCEL/COMPLETED (취소완료)
      // - REFUND_COMPLETED   → REFUND/COMPLETED (환불완료)
      const refundPlan =
        status === OrderStatus.EXPIRED
          ? { type: RefundType.REFUND, status: RefundStatus.REQUESTED }
          : status === OrderStatus.PAYMENT_CANCELLED
            ? { type: RefundType.CANCEL, status: RefundStatus.COMPLETED }
            : status === OrderStatus.REFUND_COMPLETED
              ? { type: RefundType.REFUND, status: RefundStatus.COMPLETED }
              : null;

      if (refundPlan) {
        const isCompleted = refundPlan.status === RefundStatus.COMPLETED;
        const isAdminApproved = pick([true, false]);
        const adminReason = pick([
          '업체 일정 만료로 인해 전액환불',
          '결제 잘못하여 취소하였다고 함',
          '서비스 진행 어려움',
          '연락 두절',
        ]);
        await this.#prisma.refund.create({
          data: {
            paymentId: payment.id,
            clientUserId: client.id,
            expertUserId: service.expertUserId,
            refundAmount: order.totalAmount,
            type: refundPlan.type,
            status: refundPlan.status,
            adminReason: isAdminApproved ? adminReason : null,
            approvedAdminId: isAdminApproved ? admin.id : null,
            requestedAt: new Date(),
            approvedAt: isCompleted ? new Date() : null,
            refundedAt: isCompleted ? new Date() : null,
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

    // 관리자 댓글 삭제 사유 후보 (다양한 케이스 검증용)
    const ADMIN_COMMENT_DELETE_REASONS = [
      '욕설/비방',
      '외부 연락처 유도',
      '스팸/광고',
      '허위·과장 정보',
      '음란성 콘텐츠',
      '운영 정책 위반',
    ];

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
        // 약 1/4 확률로 관리자 삭제 (다양한 사유로 분산)
        const isAdminDeleted = (i + c) % 4 === 0;
        await this.#prisma.comment.create({
          data: {
            postId: post.id,
            userId: pick(allUsers).id,
            content: pick(COMMENT_TEMPLATES),
            deletedAt: isAdminDeleted ? new Date() : null,
            deleteReason: isAdminDeleted
              ? pick(ADMIN_COMMENT_DELETE_REASONS)
              : null,
            deletedByAdminId: isAdminDeleted ? admin.id : null,
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
      ...Array.from({ length: 12 }, () => CsChatStatus.OPEN),
      ...Array.from({ length: 8 }, () => CsChatStatus.ASSIGNED),
      ...Array.from({ length: 5 }, () => CsChatStatus.CLOSED),
    ];

    for (const status of statusPlan) {
      const client = pick(clients);
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
    const [users, faqs, csChatRooms, mainSettings] = await Promise.all([
      this.#prisma.user.findMany({ select: { id: true, role: true } }),
      this.#prisma.faq.findMany({ select: { id: true } }),
      this.#prisma.csChatRoom.findMany({ select: { id: true } }),
      this.#prisma.mainSetting.findMany({ select: { id: true } }),
    ]);

    // 액션의 의미에 맞게 user 풀 분리
    // - 전문가 승인/거절 → expert role
    // - 취소/환불 승인 → client role (구매자가 요청한 거니까)
    // - 블랙리스트 등록/해제 → 어떤 role이든 가능 (전체)
    const expertUsers = users.filter((u) => u.role === Role.EXPERT);
    const clientUsers = users.filter((u) => u.role === Role.CLIENT);

    const EXPERT_TARGET_ACTIONS = new Set<AdminActionType>([
      AdminActionType.EXPERT_APPROVED,
      AdminActionType.EXPERT_REJECTED,
    ]);
    const CLIENT_TARGET_ACTIONS = new Set<AdminActionType>([
      AdminActionType.CANCEL_APPROVED,
      AdminActionType.REFUND_APPROVED,
    ]);
    const BLACKLIST_ACTIONS = new Set<AdminActionType>([
      AdminActionType.BLACKLIST_ADDED,
      AdminActionType.BLACKLIST_REMOVED,
    ]);
    const FAQ_ACTIONS = new Set<AdminActionType>([
      AdminActionType.FAQ_CREATED,
      AdminActionType.FAQ_UPDATED,
      AdminActionType.FAQ_DELETED,
    ]);
    const CS_ACTIONS = new Set<AdminActionType>([
      AdminActionType.CS_ASSIGNED,
      AdminActionType.CS_CLOSED,
    ]);
    const MAIN_ACTIONS = new Set<AdminActionType>([
      AdminActionType.MAIN_UPDATED,
    ]);

    const pickRefId = (actionType: AdminActionType): string | null => {
      if (EXPERT_TARGET_ACTIONS.has(actionType)) return pick(expertUsers).id;
      if (CLIENT_TARGET_ACTIONS.has(actionType)) return pick(clientUsers).id;
      if (BLACKLIST_ACTIONS.has(actionType)) return pick(users).id;
      if (FAQ_ACTIONS.has(actionType)) return pick(faqs).id;
      if (CS_ACTIONS.has(actionType)) return pick(csChatRooms).id;
      if (MAIN_ACTIONS.has(actionType)) {
        if (mainSettings.length === 0) return null;
        return pick(mainSettings).id;
      }
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

  // ─── 22. Orders API 테스트 시드 ──────────────────────────────────────
  // 고정 계정(client@test.com / expert@test.com / other@test.com) + 상태별 주문 묶음.
  // 비밀번호 Test1234!, 기존 시드와 별개로 끝에 추가됨.
  async #seedOrdersApiTestData(): Promise<string> {
    const testPasswordHash = await bcrypt.hash('Test1234!', 10);
    const regions = Object.values(Region);

    // 1) 고정 계정 3개
    const [client, expert, other] = await Promise.all([
      this.#prisma.user.create({
        data: {
          email: 'client@test.com',
          name: '테스트 의뢰인',
          password: testPasswordHash,
          provider: AuthProvider.LOCAL,
          role: Role.CLIENT,
          profileImageUrl: pickProfileImage(),
          region: pick(regions),
          phoneNumber: faker.phone.number(),
        },
      }),
      this.#prisma.user.create({
        data: {
          email: 'expert@test.com',
          name: '테스트 전문가',
          password: testPasswordHash,
          provider: AuthProvider.LOCAL,
          role: Role.EXPERT,
          profileImageUrl: pickProfileImage(),
          region: pick(regions),
          phoneNumber: faker.phone.number(),
          bankName: '국민',
          bankAccount: faker.finance.accountNumber(),
        },
      }),
      this.#prisma.user.create({
        data: {
          email: 'other@test.com',
          name: '테스트 타인',
          password: testPasswordHash,
          provider: AuthProvider.LOCAL,
          role: Role.CLIENT,
          profileImageUrl: pickProfileImage(),
          region: pick(regions),
          phoneNumber: faker.phone.number(),
        },
      }),
    ]);

    // 2) expert ExpertProfile (승인 완료) — 승인한 관리자 한 명 골라서 박음
    const approvingAdmin = await this.#prisma.admin.findFirst();
    if (!approvingAdmin) {
      throw new Error('관리자가 없음 — Admin 시드 누락');
    }
    await this.#prisma.expertProfile.create({
      data: {
        userId: expert.id,
        isApplied: true,
        appliedAt: faker.date.recent({ days: 60 }),
        isApproved: true,
        approvedAt: faker.date.recent({ days: 30 }),
        approvedByAdminId: approvingAdmin.id,
        businessName: faker.company.name(),
        businessNumber: faker.string.numeric(10),
        ceoName: expert.name ?? '테스트 전문가',
        contactTimeStart: '10:00',
        contactTimeEnd: '19:00',
        foundedYear: 202_005,
        employeeMin: 1,
        employeeMax: 10,
        description: 'Orders API 테스트용 전문가입니다',
      },
    });

    // 2-1) client / other 의 ClientProfile (어드민 유저 상세에서 닉네임·관심분야 노출용)
    await Promise.all([
      this.#prisma.clientProfile.create({
        data: { userId: client.id, nickname: '카키쿠키' },
      }),
      this.#prisma.clientProfile.create({
        data: { userId: other.id, nickname: '타인유저' },
      }),
    ]);

    // 3) expert 소유 ACTIVE 서비스 1개
    const serviceGroup = await this.#prisma.serviceGroup.findFirst();
    const serviceCategory = await this.#prisma.serviceCategory.findFirst();
    if (!serviceGroup || !serviceCategory) {
      throw new Error('카탈로그 시드 누락 — ServiceGroup/Category 없음');
    }

    const expertService = await this.#prisma.service.create({
      data: {
        expertUserId: expert.id,
        title: '[테스트] Orders API용 서비스',
        workDuration: 30,
        revisionCount: 3,
        serviceScope: 'Orders API 테스트 전용',
        servicePrice: 1_000_000,
        description: 'Orders API 테스트용 서비스입니다',
        preparationNotes: '준비 사항 안내',
        refundPolicy: '환불 정책 안내',
        status: ServiceStatus.ACTIVE,
        serviceGroupId: serviceGroup.id,
        serviceCategoryId: serviceCategory.id,
      },
    });

    // 4) 상태별 주문 묶음 (client ↔ expert)
    const platformFee = Math.floor(expertService.servicePrice * 0.1);
    const totalAmount = expertService.servicePrice + platformFee;

    const futureDate = (days: number): Date =>
      new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const pastDate = (days: number): Date =>
      new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // 시안 흐름: Order.status는 "진행 상태"만 표현, 취소·환불은 Refund 모델로 별도 트래킹
    const orderPlan: {
      status: OrderStatus;
      endDate: Date | null;
      paymentStatus: PaymentStatus;
      confirmedAt: Date | null;
      refund: { type: RefundType; status: RefundStatus } | null;
    }[] = [
      // NEGOTIATING × 1 — 일반 논의중 (취소·환불 없음)
      {
        status: OrderStatus.NEGOTIATING,
        endDate: null,
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: null,
        refund: null,
      },
      // 디자인 03번: 논의중 + 취소요청
      {
        status: OrderStatus.NEGOTIATING,
        endDate: null,
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: null,
        refund: { type: RefundType.CANCEL, status: RefundStatus.REQUESTED },
      },
      // IN_PROGRESS × 2
      {
        status: OrderStatus.IN_PROGRESS,
        endDate: futureDate(30),
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: null,
        refund: null,
      },
      {
        status: OrderStatus.IN_PROGRESS,
        endDate: futureDate(30),
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: null,
        refund: null,
      },
      // DEADLINE_IMMINENT × 1
      {
        status: OrderStatus.DEADLINE_IMMINENT,
        endDate: futureDate(2),
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: null,
        refund: null,
      },
      // 디자인 05번: 기간만료 + 환불요청
      {
        status: OrderStatus.EXPIRED,
        endDate: pastDate(5),
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: null,
        refund: { type: RefundType.REFUND, status: RefundStatus.REQUESTED },
      },
      // WORK_COMPLETED × 1
      {
        status: OrderStatus.WORK_COMPLETED,
        endDate: futureDate(15),
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: null,
        refund: null,
      },
      // PURCHASE_CONFIRMED × 1
      {
        status: OrderStatus.PURCHASE_CONFIRMED,
        endDate: futureDate(10),
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: new Date(),
        refund: null,
      },
      // SETTLEMENT_REQUESTED × 1
      {
        status: OrderStatus.SETTLEMENT_REQUESTED,
        endDate: futureDate(5),
        paymentStatus: PaymentStatus.PAID,
        confirmedAt: new Date(),
        refund: null,
      },
      // 디자인 06번: 취소 + 취소완료
      {
        status: OrderStatus.PAYMENT_CANCELLED,
        endDate: null,
        paymentStatus: PaymentStatus.CANCELLED,
        confirmedAt: null,
        refund: { type: RefundType.CANCEL, status: RefundStatus.COMPLETED },
      },
      // 디자인 07번: 환불 + 환불완료
      {
        status: OrderStatus.REFUND_COMPLETED,
        endDate: pastDate(10),
        paymentStatus: PaymentStatus.REFUNDED,
        confirmedAt: null,
        refund: { type: RefundType.REFUND, status: RefundStatus.COMPLETED },
      },
    ];

    for (const plan of orderPlan) {
      const order = await this.#prisma.order.create({
        data: {
          clientUserId: client.id,
          expertUserId: expert.id,
          serviceId: expertService.id,
          agreedServicePrice: expertService.servicePrice,
          platformFee,
          totalAmount,
          status: plan.status,
          startDate: pastDate(rand(1, 14)),
          endDate: plan.endDate,
          confirmedAt: plan.confirmedAt,
        },
      });

      const payment = await this.#prisma.payment.create({
        data: {
          orderId: order.id,
          clientUserId: client.id,
          paidAmount: order.totalAmount,
          status: plan.paymentStatus,
          method: pick([
            '신용카드 롯데',
            '신용카드 신한',
            '신용카드 KB국민',
            '신용카드 삼성',
            '신용카드 현대',
            '신용카드 하나',
          ]),
          installmentMonths: pick([1, 1, 1, 1, 2, 3, 6, 12]),
          approvedAt: new Date(),
        },
      });

      if (plan.refund) {
        const isCompleted = plan.refund.status === RefundStatus.COMPLETED;
        await this.#prisma.refund.create({
          data: {
            paymentId: payment.id,
            clientUserId: client.id,
            expertUserId: expert.id,
            refundAmount: order.totalAmount,
            type: plan.refund.type,
            status: plan.refund.status,
            requestedAt: new Date(),
            approvedAt: isCompleted ? new Date() : null,
            refundedAt: isCompleted ? new Date() : null,
          },
        });
      }
    }

    // 5) 타인 소유 IN_PROGRESS 주문 1건 (other ↔ 임의의 ACTIVE 서비스 보유 expert)
    // ACTIVE 서비스부터 찾고 거기서 expertUserId를 도출 (미승인 expert 회피)
    const otherExpertService = await this.#prisma.service.findFirst({
      where: {
        status: ServiceStatus.ACTIVE,
        expertUserId: { not: expert.id },
      },
    });
    if (!otherExpertService) {
      throw new Error('타인용 ACTIVE 서비스가 없음');
    }

    const otherPlatformFee = Math.floor(otherExpertService.servicePrice * 0.1);
    const otherOrder = await this.#prisma.order.create({
      data: {
        clientUserId: other.id,
        expertUserId: otherExpertService.expertUserId,
        serviceId: otherExpertService.id,
        agreedServicePrice: otherExpertService.servicePrice,
        platformFee: otherPlatformFee,
        totalAmount: otherExpertService.servicePrice + otherPlatformFee,
        status: OrderStatus.IN_PROGRESS,
        startDate: pastDate(7),
        endDate: futureDate(30),
      },
    });
    await this.#prisma.payment.create({
      data: {
        orderId: otherOrder.id,
        clientUserId: other.id,
        paidAmount: otherOrder.totalAmount,
        status: PaymentStatus.PAID,
        method: pick([
          '신용카드 롯데',
          '신용카드 신한',
          '신용카드 KB국민',
          '신용카드 삼성',
          '신용카드 현대',
          '신용카드 하나',
        ]),
        installmentMonths: pick([1, 1, 1, 1, 2, 3, 6, 12]),
        approvedAt: new Date(),
      },
    });

    return expertService.id;
  }

  // ─── 23. Admin user 상세 하위 리스트 테스트 시드 ────────────────────
  // client@test.com / expert@test.com 각자에게:
  // - reports received 30건, reports sent 30건
  // - posts 30건 (관리자 삭제 5 + 본인 삭제 5 + 노출중 20)
  // - comments 30건 (관리자 삭제 5 + 본인 삭제 5 + 노출중 20)
  async #seedAdminUserSubListTestData(): Promise<void> {
    const ADMIN_DELETE_REASONS = [
      '욕설/비방',
      '외부 연락처 유도',
      '스팸/광고',
      '허위·과장 정보',
      '운영 정책 위반',
    ];
    const categories = Object.values(CommunityCategory);

    const [client, expert] = await Promise.all([
      this.#prisma.user.findUnique({ where: { email: 'client@test.com' } }),
      this.#prisma.user.findUnique({ where: { email: 'expert@test.com' } }),
    ]);
    if (!client || !expert) {
      throw new Error('test 계정 누락 (client@test.com / expert@test.com)');
    }

    const admin = await this.#prisma.admin.findFirst();
    if (!admin) throw new Error('Admin 없음');

    // 신고는 CLIENT ↔ EXPERT 양방향만 가능 → role 별로 풀 분리
    const [clientUsers, expertUsers] = await Promise.all([
      this.#prisma.user.findMany({
        where: {
          role: Role.CLIENT,
          email: { notIn: ['client@test.com', 'other@test.com'] },
          isDeleted: false,
        },
        take: 30,
      }),
      this.#prisma.user.findMany({
        where: {
          role: Role.EXPERT,
          email: { notIn: ['expert@test.com'] },
          isDeleted: false,
        },
        take: 30,
      }),
    ]);

    for (const target of [client, expert]) {
      // target의 반대 role 풀 — 신고 상대 user
      const counterparts =
        target.role === Role.CLIENT ? expertUsers : clientUsers;

      // 1. reports received — counterparts가 target을 신고
      for (let i = 0; i < 30; i++) {
        await this.#prisma.report.create({
          data: {
            reporterId: pick(counterparts).id,
            reportedId: target.id,
            reason: pick(REPORT_REASONS),
            status: i < 15 ? ReportStatus.PENDING : ReportStatus.COMPLETED,
            detail: faker.lorem.paragraph(),
          },
        });
      }

      // 2. reports sent — target이 counterparts를 신고
      for (let i = 0; i < 30; i++) {
        await this.#prisma.report.create({
          data: {
            reporterId: target.id,
            reportedId: pick(counterparts).id,
            reason: pick(REPORT_REASONS),
            status: i < 15 ? ReportStatus.PENDING : ReportStatus.COMPLETED,
            detail: faker.lorem.paragraph(),
          },
        });
      }

      // 3. posts — target 작성 30건 (관리자 삭제 5 + 본인 삭제 5 + 노출중 20)
      for (let i = 0; i < 30; i++) {
        const isAdminDeleted = i < 5;
        const isUserDeleted = i >= 5 && i < 10;
        await this.#prisma.communityPost.create({
          data: {
            userId: target.id,
            category: pick(categories),
            title: faker.lorem.sentence({ min: 3, max: 8 }),
            content: faker.lorem.paragraphs(rand(2, 5)),
            deletedAt: isAdminDeleted || isUserDeleted ? new Date() : null,
            deleteReason: isAdminDeleted ? pick(ADMIN_DELETE_REASONS) : null,
            deletedByAdminId: isAdminDeleted ? admin.id : null,
          },
        });
      }

      // 4. comments — target 작성 30건 (관리자 5 + 본인 5 + 노출중 20)
      // 댓글은 검증이 user 기준이라 게시글 분포 무관 → 첫 게시글에 다 박음
      const anyPost = await this.#prisma.communityPost.findFirst();
      if (!anyPost) throw new Error('post 없음');

      for (let i = 0; i < 30; i++) {
        const isAdminDeleted = i < 5;
        const isUserDeleted = i >= 5 && i < 10;
        await this.#prisma.comment.create({
          data: {
            postId: anyPost.id,
            userId: target.id,
            content: pick(COMMENT_TEMPLATES),
            deletedAt: isAdminDeleted || isUserDeleted ? new Date() : null,
            deleteReason: isAdminDeleted ? pick(ADMIN_DELETE_REASONS) : null,
            deletedByAdminId: isAdminDeleted ? admin.id : null,
          },
        });
      }
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
