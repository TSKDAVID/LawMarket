/**
 * Types for the schema in supabase/migrations/0001_init.sql.
 *
 * Hand-written for now. Once the Supabase CLI is linked, regenerate with:
 *   supabase gen types typescript --linked > lib/supabase/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "client" | "lawyer" | "admin";
export type ServicePricingMode = "fixed" | "from" | "range";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";
export type OrderStatus =
  | "pending"
  | "awaiting_payment"
  | "paid"
  | "cancelled"
  | "completed";
export type PostStatus = "draft" | "published";

type Timestamps = {
  created_at: string;
  updated_at: string;
};

export type ProfileRow = Timestamps & {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
};

export type CategoryRow = Timestamps & {
  id: string;
  slug: string;
  name_en: string;
  name_ka: string;
  icon: string;
  sort_order: number;
};

export type LawyerRow = Timestamps & {
  id: string;
  profile_id: string | null;
  slug: string;
  name: string;
  initials: string;
  avatar_color: string;
  photo_url: string | null;
  headline_en: string;
  headline_ka: string;
  bio_en: string;
  bio_ka: string;
  city: string;
  languages: string[];
  years_experience: number;
  verified: boolean;
  published: boolean;
  suspended: boolean;
  sort_order: number;
  phone: string | null;
  contact_email: string | null;
};

export type ChangeRequestKind = "service" | "case";
export type ChangeRequestStatus = "pending" | "approved" | "rejected";

export type LawyerCaseRow = Timestamps & {
  id: string;
  lawyer_id: string;
  category_id: string | null;
  title_ka: string;
  title_en: string;
  description_ka: string;
  description_en: string;
  year: number | null;
  outcome_ka: string;
  outcome_en: string;
  published: boolean;
  sort_order: number;
};

export type ChangeRequestRow = Timestamps & {
  id: string;
  kind: ChangeRequestKind;
  lawyer_id: string;
  submitted_by: string | null;
  payload: Json;
  status: ChangeRequestStatus;
  review_note: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_record_id: string | null;
};

export type LawyerPracticeAreaRow = {
  lawyer_id: string;
  category_id: string;
};

export type ServiceRow = Timestamps & {
  id: string;
  slug: string;
  category_id: string;
  lawyer_id: string;
  title_en: string;
  title_ka: string;
  description_en: string;
  description_ka: string;
  price: number;
  price_max: number | null;
  pricing_mode: ServicePricingMode;
  currency: string;
  duration_minutes: number | null;
  popular: boolean;
  published: boolean;
  includes_en: string[];
  includes_ka: string[];
  faq_en: Json;
  faq_ka: Json;
  sort_order: number;
  view_count: number;
  purchase_count: number;
};

export type ReviewRow = Timestamps & {
  id: string;
  author_name: string;
  author_role_en: string;
  author_role_ka: string;
  rating: number;
  quote_en: string;
  quote_ka: string;
  service_id: string | null;
  lawyer_id: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
};

export type SiteContentRow = {
  key: string;
  value_en: string;
  value_ka: string;
  description: string | null;
  updated_at: string;
  updated_by: string | null;
};

export type SiteSettingsRow = {
  id: number;
  contact_email: string;
  contact_phone: string;
  contact_phone_href: string;
  contact_location_en: string;
  contact_location_ka: string;
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
  hero_media_type: "video" | "image" | "embed" | "none";
  hero_media_url: string;
  hero_poster_url: string;
  hero_embed_url: string;
  legal_updated_at: string;
  banner_visible: boolean;
  updated_at: string;
  updated_by: string | null;
};

export type SitePageRow = {
  slug: string;
  title_en: string;
  title_ka: string;
  subtitle_en: string;
  subtitle_ka: string;
  sections: Json;
  notice_en: string;
  notice_ka: string;
  updated_at: string;
  updated_by: string | null;
};

export type PostRow = Timestamps & {
  id: string;
  slug: string;
  title_en: string;
  title_ka: string;
  excerpt_en: string;
  excerpt_ka: string;
  body_en: string;
  body_ka: string;
  cover_url: string | null;
  author_id: string | null;
  status: PostStatus;
  published_at: string | null;
};

export type LawyerAvailabilityRow = Timestamps & {
  id: string;
  lawyer_id: string;
  date: string;
  slots: string[];
};

export type BookingRow = Timestamps & {
  id: string;
  lawyer_id: string;
  service_id: string | null;
  user_id: string | null;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  date: string;
  time: string;
  status: BookingStatus;
  client_case_id: string | null;
};

export type OrderRow = Timestamps & {
  id: string;
  service_id: string;
  lawyer_id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  price: number;
  currency: string;
  status: OrderStatus;
};

export type ClientCaseStatus = "open" | "closed" | "matched";
export type ProposalStatus = "pending" | "withdrawn" | "accepted" | "declined";

export type ClientCaseRow = Timestamps & {
  id: string;
  client_id: string;
  category_id: string | null;
  title: string;
  description: string;
  city: string | null;
  status: ClientCaseStatus;
};

export type CaseProposalRow = Timestamps & {
  id: string;
  case_id: string;
  lawyer_id: string;
  price: number;
  currency: string;
  duration_minutes: number | null;
  message: string;
  status: ProposalStatus;
};

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  handled: boolean;
  created_at: string;
};

/** Columns the database fills in for us on insert. */
type Generated = "id" | "created_at" | "updated_at";

type TableOf<
  Row,
  InsertOptional extends keyof Row = never,
  Rel extends unknown[] = []
> = {
  Row: Row;
  Insert: Omit<Row, (Generated & keyof Row) | InsertOptional> &
    Partial<Pick<Row, (Generated & keyof Row) | InsertOptional>>;
  Update: Partial<Row>;
  Relationships: Rel;
};

export type Database = {
  public: {
    Tables: {
      profiles: TableOf<ProfileRow, "role" | "email" | "full_name" | "phone">;
      categories: TableOf<CategoryRow, "icon" | "sort_order">;
      lawyers: TableOf<
        LawyerRow,
        | "profile_id"
        | "photo_url"
        | "headline_en"
        | "headline_ka"
        | "bio_en"
        | "bio_ka"
        | "city"
        | "languages"
        | "years_experience"
        | "verified"
        | "published"
        | "suspended"
        | "sort_order"
        | "avatar_color"
        | "phone"
        | "contact_email",
        [
          {
            foreignKeyName: "lawyers_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ]
      >;
      lawyer_practice_areas: {
        Row: LawyerPracticeAreaRow;
        Insert: LawyerPracticeAreaRow;
        Update: Partial<LawyerPracticeAreaRow>;
        // Declared so `lawyers(*, lawyer_practice_areas(category_id))`
        // type-checks as an embedded array rather than a query error.
        Relationships: [
          {
            foreignKeyName: "lawyer_practice_areas_lawyer_id_fkey";
            columns: ["lawyer_id"];
            isOneToOne: false;
            referencedRelation: "lawyers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lawyer_practice_areas_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      services: TableOf<
        ServiceRow,
        | "currency"
        | "duration_minutes"
        | "popular"
        | "published"
        | "includes_en"
        | "includes_ka"
        | "faq_en"
        | "faq_ka"
        | "sort_order"
        | "description_en"
        | "description_ka"
        | "view_count"
        | "purchase_count"
        | "pricing_mode"
        | "price_max"
      >;
      reviews: TableOf<
        ReviewRow,
        | "author_role_en"
        | "author_role_ka"
        | "quote_en"
        | "quote_ka"
        | "service_id"
        | "lawyer_id"
        | "featured"
        | "published"
        | "sort_order"
      >;
      site_content: {
        Row: SiteContentRow;
        Insert: Pick<SiteContentRow, "key"> & Partial<SiteContentRow>;
        Update: Partial<SiteContentRow>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettingsRow;
        Insert: Pick<SiteSettingsRow, "id"> & Partial<SiteSettingsRow>;
        Update: Partial<SiteSettingsRow>;
        Relationships: [];
      };
      site_pages: {
        Row: SitePageRow;
        Insert: Pick<SitePageRow, "slug"> & Partial<SitePageRow>;
        Update: Partial<SitePageRow>;
        Relationships: [];
      };
      posts: TableOf<
        PostRow,
        | "title_en"
        | "title_ka"
        | "excerpt_en"
        | "excerpt_ka"
        | "body_en"
        | "body_ka"
        | "cover_url"
        | "author_id"
        | "status"
        | "published_at"
      >;
      lawyer_availability: TableOf<LawyerAvailabilityRow, "slots">;
      bookings: TableOf<
        BookingRow,
        "service_id" | "user_id" | "notes" | "status" | "client_case_id"
      >;
      orders: TableOf<
        OrderRow,
        "user_id" | "notes" | "status" | "currency"
      >;
      contact_messages: {
        Row: ContactMessageRow;
        Insert: Omit<ContactMessageRow, "id" | "created_at" | "handled"> &
          Partial<Pick<ContactMessageRow, "id" | "created_at" | "handled">>;
        Update: Partial<ContactMessageRow>;
        Relationships: [];
      };
      lawyer_cases: TableOf<
        LawyerCaseRow,
        | "category_id"
        | "title_en"
        | "description_ka"
        | "description_en"
        | "year"
        | "outcome_ka"
        | "outcome_en"
        | "published"
        | "sort_order"
      >;
      change_requests: TableOf<
        ChangeRequestRow,
        | "submitted_by"
        | "status"
        | "review_note"
        | "reviewed_by"
        | "reviewed_at"
        | "created_record_id",
        [
          {
            foreignKeyName: "change_requests_lawyer_id_fkey";
            columns: ["lawyer_id"];
            isOneToOne: false;
            referencedRelation: "lawyers";
            referencedColumns: ["id"];
          },
        ]
      >;
      client_cases: TableOf<
        ClientCaseRow,
        "category_id" | "city" | "status"
      >;
      case_proposals: TableOf<
        CaseProposalRow,
        "currency" | "duration_minutes" | "message" | "status"
      >;
    };
    Views: Record<never, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_staff: { Args: Record<string, never>; Returns: boolean };
      is_active_lawyer: { Args: Record<string, never>; Returns: boolean };
      current_lawyer_id: { Args: Record<string, never>; Returns: string | null };
      owns_client_case: { Args: { p_case_id: string }; Returns: boolean };
      lawyer_proposed_on_case: { Args: { p_case_id: string }; Returns: boolean };
      client_case_is_open: { Args: { p_case_id: string }; Returns: boolean };
      record_service_view: { Args: { p_service_id: string }; Returns: undefined };
    };
    Enums: {
      user_role: UserRole;
      booking_status: BookingStatus;
      order_status: OrderStatus;
      post_status: PostStatus;
      change_request_kind: ChangeRequestKind;
      change_request_status: ChangeRequestStatus;
      client_case_status: ClientCaseStatus;
      proposal_status: ProposalStatus;
      service_pricing_mode: ServicePricingMode;
    };
    CompositeTypes: Record<never, never>;
  };
};
