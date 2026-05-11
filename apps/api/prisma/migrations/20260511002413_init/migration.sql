-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE', 'KAKAO', 'NAVER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'EXPERT');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('SEOUL', 'BUSAN', 'DAEGU', 'INCHEON', 'GWANGJU', 'DAEJEON', 'ULSAN', 'SEJONG', 'GYEONGGI_NORTH', 'GYEONGGI_SOUTH', 'GANGWON', 'CHUNGBUK', 'CHUNGNAM', 'JEONBUK', 'JEONNAM', 'GYEONGBUK', 'GYEONGNAM', 'JEJU');

-- CreateEnum
CREATE TYPE "TechStackName" AS ENUM ('JAVASCRIPT', 'TYPESCRIPT', 'PYTHON', 'JAVA', 'KOTLIN', 'SWIFT', 'REACT', 'NEXTJS', 'VUE', 'REACT_NATIVE', 'NODEJS', 'NESTJS', 'SPRING', 'DJANGO', 'FASTAPI', 'POSTGRESQL', 'MYSQL', 'MONGODB', 'AWS', 'DOCKER');

-- CreateEnum
CREATE TYPE "ServiceTypeName" AS ENUM ('IT_COACHING', 'PROJECT_REQUEST');

-- CreateEnum
CREATE TYPE "ServiceCategoryName" AS ENUM ('WEB', 'APP', 'AI', 'GAME', 'DATA_ANALYTICS');

-- CreateEnum
CREATE TYPE "BusinessSector" AS ENUM ('PUBLIC_INSTITUTION', 'ECOMMERCE', 'LEGAL_TAX', 'REAL_ESTATE', 'MEDICAL_PHARMA');

-- CreateEnum
CREATE TYPE "StackType" AS ENUM ('DESIGN', 'FRONTEND', 'BACKEND');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CLOSED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('NEGOTIATING', 'CANCEL_REQUESTED', 'PAYMENT_CANCELLED', 'IN_PROGRESS', 'DEADLINE_IMMINENT', 'EXPIRED', 'WORK_COMPLETED', 'PURCHASE_CONFIRMED', 'SETTLEMENT_REQUESTED', 'SETTLEMENT_COMPLETED', 'REFUND_REQUESTED', 'REFUND_COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "RefundType" AS ENUM ('CANCEL', 'REFUND');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "CommunityCategory" AS ENUM ('QUESTION', 'TIP', 'REVIEW', 'STUDY_GROUP', 'FREE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('COMMUNITY', 'TRANSACTION', 'REMINDER');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('POST_COMMENT', 'POST_REPLY', 'POST_LIKE', 'ORDER_CREATED', 'ORDER_CANCELLED', 'PAYMENT_SUCCESS', 'REFUND_REQUESTED', 'SETTLEMENT_DONE', 'PURCHASE_CONFIRM_REQUEST', 'DEADLINE_REMINDER');

-- CreateEnum
CREATE TYPE "ReferenceType" AS ENUM ('SERVICE', 'ORDER', 'POST', 'COMMENT', 'PAYMENT', 'REFUND');

-- CreateEnum
CREATE TYPE "MainSectionType" AS ENUM ('POPULAR_IT_COACHING', 'POPULAR_PROJECT_REQUEST', 'MOVEIT_POPULAR_PROJECT_EXPERT', 'MOVEIT_POPULAR_COACHING', 'RECOMMENDED_IT_COACHING', 'RECOMMENDED_PROJECT_REQUEST');

-- CreateEnum
CREATE TYPE "MainTargetType" AS ENUM ('USER', 'SERVICE');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'FILE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "SystemMessageType" AS ENUM ('TRADE_REQUEST_SENT', 'TRADE_REQUEST_RECEIVED', 'TRADE_CANCELED', 'PAYMENT_REQUEST', 'PAYMENT_HELD', 'PAYMENT_COMPLETED', 'SCHEDULE_REQUEST', 'SCHEDULE_REGISTERED', 'ORDER_COMPLETION_PENDING');

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "CsChatStatus" AS ENUM ('OPEN', 'ASSIGNED', 'CLOSED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "provider_id" TEXT,
    "role" "Role" NOT NULL,
    "profile_image_url" TEXT,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "region" "Region",
    "bank_name" TEXT,
    "bank_account" TEXT,
    "phone_number" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_super" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "nickname" TEXT,

    CONSTRAINT "client_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "reject_reason" TEXT,
    "business_name" TEXT,
    "business_number" TEXT,
    "ceo_name" TEXT,
    "contact_time_start" TEXT,
    "contact_time_end" TEXT,
    "founded_year" INTEGER,
    "employee_min" INTEGER,
    "employee_max" INTEGER,
    "description" TEXT,

    CONSTRAINT "expert_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tech_stacks" (
    "id" UUID NOT NULL,
    "name" "TechStackName" NOT NULL,

    CONSTRAINT "tech_stacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_types" (
    "id" UUID NOT NULL,
    "category" "ServiceTypeName" NOT NULL,

    CONSTRAINT "service_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_categories" (
    "id" UUID NOT NULL,
    "detail" "ServiceCategoryName" NOT NULL,

    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_interest_categories" (
    "id" UUID NOT NULL,
    "client_profile_id" UUID NOT NULL,
    "service_type_id" UUID NOT NULL,
    "service_category_id" UUID NOT NULL,

    CONSTRAINT "client_interest_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_specialty_categories" (
    "id" UUID NOT NULL,
    "expert_profile_id" UUID NOT NULL,
    "service_type_id" UUID NOT NULL,
    "service_category_id" UUID NOT NULL,

    CONSTRAINT "expert_specialty_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_tech_stacks" (
    "id" UUID NOT NULL,
    "expert_profile_id" UUID NOT NULL,
    "tech_stack_id" UUID NOT NULL,

    CONSTRAINT "expert_tech_stacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolios" (
    "id" UUID NOT NULL,
    "expert_profile_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "business_sector" "BusinessSector" NOT NULL,

    CONSTRAINT "portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_images" (
    "id" UUID NOT NULL,
    "portfolio_id" UUID NOT NULL,
    "img_url" TEXT NOT NULL,
    "is_main" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "portfolio_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_skills" (
    "id" UUID NOT NULL,
    "portfolio_id" UUID NOT NULL,
    "stack_name" TEXT NOT NULL,
    "stack_type" "StackType" NOT NULL,

    CONSTRAINT "portfolio_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" UUID NOT NULL,
    "expert_user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "work_duration" INTEGER NOT NULL,
    "revision_count" INTEGER NOT NULL,
    "service_scope" TEXT NOT NULL,
    "service_price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "refund_policy" TEXT NOT NULL,
    "status" "ServiceStatus" NOT NULL,
    "service_type_id" UUID NOT NULL,
    "service_category_id" UUID NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_tech_stacks" (
    "id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "tech_stack_id" UUID NOT NULL,

    CONSTRAINT "service_tech_stacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_images" (
    "id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "img_url" TEXT NOT NULL,
    "is_main" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "service_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_steps" (
    "id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "service_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_faqs" (
    "id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "client_user_id" UUID NOT NULL,
    "expert_user_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "agreed_service_price" INTEGER NOT NULL,
    "platform_fee" INTEGER NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "refund_reason" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "client_user_id" UUID NOT NULL,
    "paid_amount" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "method" TEXT NOT NULL,
    "payment_key" TEXT NOT NULL,
    "raw_data" JSONB NOT NULL,
    "approved_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refunds" (
    "id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "client_user_id" UUID NOT NULL,
    "expert_user_id" UUID NOT NULL,
    "refund_amount" INTEGER NOT NULL,
    "type" "RefundType" NOT NULL,
    "status" "RefundStatus" NOT NULL,
    "reason" TEXT NOT NULL,
    "approved_admin_id" UUID NOT NULL,
    "requested_at" TIMESTAMP(3) NOT NULL,
    "approved_at" TIMESTAMP(3),
    "refunded_at" TIMESTAMP(3),
    "payment_key" TEXT NOT NULL,
    "raw_data" JSONB NOT NULL,

    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_services" (
    "id" UUID NOT NULL,
    "client_user_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,

    CONSTRAINT "favorite_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_experts" (
    "id" UUID NOT NULL,
    "client_user_id" UUID NOT NULL,
    "expert_user_id" UUID NOT NULL,

    CONSTRAINT "favorite_experts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "client_user_id" UUID NOT NULL,
    "expert_user_id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "detail" TEXT NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports_images" (
    "id" UUID NOT NULL,
    "reports_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "reports_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_posts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "category" "CommunityCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),
    "delete_reason" TEXT,
    "deleted_by_admin_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "parent_comment_id" UUID,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moveit_notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "category" "NotificationCategory" NOT NULL,
    "content" TEXT NOT NULL,
    "reference_type" "ReferenceType" NOT NULL,
    "reference_id" UUID NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moveit_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "action_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "main_settings" (
    "id" UUID NOT NULL,
    "section_type" "MainSectionType" NOT NULL,
    "target_type" "MainTargetType" NOT NULL,
    "target_user_id" UUID,
    "target_service_id" UUID,

    CONSTRAINT "main_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_rooms" (
    "id" UUID NOT NULL,
    "client_user_id" UUID NOT NULL,
    "expert_user_id" UUID NOT NULL,
    "current_service_id" UUID NOT NULL,
    "last_message_id" UUID,

    CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_participants" (
    "id" UUID NOT NULL,
    "chat_room_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "last_read_message_id" UUID,

    CONSTRAINT "chat_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "chat_room_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "type" "MessageType" NOT NULL,
    "system_type" "SystemMessageType",
    "reference_type" TEXT,
    "reference_id" UUID,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_attachments" (
    "id" UUID NOT NULL,
    "message_id" UUID NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,

    CONSTRAINT "message_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cs_chat_rooms" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "assigned_admin_id" UUID,
    "last_message_id" UUID,
    "status" "CsChatStatus" NOT NULL,

    CONSTRAINT "cs_chat_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cs_messages" (
    "id" UUID NOT NULL,
    "chat_room_id" UUID NOT NULL,
    "senderType" "SenderType" NOT NULL,
    "senderUserId" UUID,
    "senderAdminId" UUID,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cs_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cs_message_attachments" (
    "id" UUID NOT NULL,
    "message_id" UUID NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,

    CONSTRAINT "cs_message_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statistics_by_seller" (
    "id" UUID NOT NULL,
    "seller_user_id" UUID NOT NULL,
    "total_transaction_amount" INTEGER NOT NULL DEFAULT 0,
    "total_transaction_count" INTEGER NOT NULL DEFAULT 0,
    "max_transaction_amount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "statistics_by_seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statistics_by_category" (
    "id" UUID NOT NULL,
    "service_type_id" UUID NOT NULL,
    "service_category_id" UUID NOT NULL,
    "total_transaction_amount" INTEGER NOT NULL DEFAULT 0,
    "total_transaction_count" INTEGER NOT NULL DEFAULT 0,
    "max_transaction_amount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "statistics_by_category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "client_profiles_user_id_key" ON "client_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "expert_profiles_user_id_key" ON "expert_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_steps_service_id_order_key" ON "service_steps"("service_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_order_id_key" ON "reviews"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_order_id_key" ON "payments"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "refunds_payment_id_key" ON "refunds"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_services_client_user_id_service_id_key" ON "favorite_services"("client_user_id", "service_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_experts_client_user_id_expert_user_id_key" ON "favorite_experts"("client_user_id", "expert_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_post_id_key" ON "likes"("user_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_rooms_client_user_id_expert_user_id_key" ON "chat_rooms"("client_user_id", "expert_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_participants_chat_room_id_user_id_key" ON "chat_participants"("chat_room_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "statistics_by_seller_seller_user_id_key" ON "statistics_by_seller"("seller_user_id");

-- AddForeignKey
ALTER TABLE "client_profiles" ADD CONSTRAINT "client_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_profiles" ADD CONSTRAINT "expert_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_interest_categories" ADD CONSTRAINT "client_interest_categories_client_profile_id_fkey" FOREIGN KEY ("client_profile_id") REFERENCES "client_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_interest_categories" ADD CONSTRAINT "client_interest_categories_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_interest_categories" ADD CONSTRAINT "client_interest_categories_service_category_id_fkey" FOREIGN KEY ("service_category_id") REFERENCES "service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_specialty_categories" ADD CONSTRAINT "expert_specialty_categories_expert_profile_id_fkey" FOREIGN KEY ("expert_profile_id") REFERENCES "expert_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_specialty_categories" ADD CONSTRAINT "expert_specialty_categories_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_specialty_categories" ADD CONSTRAINT "expert_specialty_categories_service_category_id_fkey" FOREIGN KEY ("service_category_id") REFERENCES "service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_tech_stacks" ADD CONSTRAINT "expert_tech_stacks_expert_profile_id_fkey" FOREIGN KEY ("expert_profile_id") REFERENCES "expert_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_tech_stacks" ADD CONSTRAINT "expert_tech_stacks_tech_stack_id_fkey" FOREIGN KEY ("tech_stack_id") REFERENCES "tech_stacks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_expert_profile_id_fkey" FOREIGN KEY ("expert_profile_id") REFERENCES "expert_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_images" ADD CONSTRAINT "portfolio_images_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_skills" ADD CONSTRAINT "portfolio_skills_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_expert_user_id_fkey" FOREIGN KEY ("expert_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_service_category_id_fkey" FOREIGN KEY ("service_category_id") REFERENCES "service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_tech_stacks" ADD CONSTRAINT "service_tech_stacks_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_tech_stacks" ADD CONSTRAINT "service_tech_stacks_tech_stack_id_fkey" FOREIGN KEY ("tech_stack_id") REFERENCES "tech_stacks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_images" ADD CONSTRAINT "service_images_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_steps" ADD CONSTRAINT "service_steps_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_faqs" ADD CONSTRAINT "service_faqs_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_expert_user_id_fkey" FOREIGN KEY ("expert_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_expert_user_id_fkey" FOREIGN KEY ("expert_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_approved_admin_id_fkey" FOREIGN KEY ("approved_admin_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_services" ADD CONSTRAINT "favorite_services_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_services" ADD CONSTRAINT "favorite_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_experts" ADD CONSTRAINT "favorite_experts_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_experts" ADD CONSTRAINT "favorite_experts_expert_user_id_fkey" FOREIGN KEY ("expert_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_expert_user_id_fkey" FOREIGN KEY ("expert_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports_images" ADD CONSTRAINT "reports_images_reports_id_fkey" FOREIGN KEY ("reports_id") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_deleted_by_admin_id_fkey" FOREIGN KEY ("deleted_by_admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moveit_notifications" ADD CONSTRAINT "moveit_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_expert_user_id_fkey" FOREIGN KEY ("expert_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_current_service_id_fkey" FOREIGN KEY ("current_service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_last_message_id_fkey" FOREIGN KEY ("last_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "chat_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "chat_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_attachments" ADD CONSTRAINT "message_attachments_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cs_chat_rooms" ADD CONSTRAINT "cs_chat_rooms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cs_chat_rooms" ADD CONSTRAINT "cs_chat_rooms_assigned_admin_id_fkey" FOREIGN KEY ("assigned_admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cs_chat_rooms" ADD CONSTRAINT "cs_chat_rooms_last_message_id_fkey" FOREIGN KEY ("last_message_id") REFERENCES "cs_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cs_messages" ADD CONSTRAINT "cs_messages_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "cs_chat_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cs_message_attachments" ADD CONSTRAINT "cs_message_attachments_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "cs_messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statistics_by_seller" ADD CONSTRAINT "statistics_by_seller_seller_user_id_fkey" FOREIGN KEY ("seller_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statistics_by_category" ADD CONSTRAINT "statistics_by_category_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statistics_by_category" ADD CONSTRAINT "statistics_by_category_service_category_id_fkey" FOREIGN KEY ("service_category_id") REFERENCES "service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
