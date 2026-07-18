export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          public_slug: string | null;
          full_name: string;
          avatar_path: string | null;
          phone: string | null;
          city: string | null;
          bio: string | null;
          is_active: boolean;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
          public_slug?: string | null;
          full_name: string;
          avatar_path?: string | null;
          phone?: string | null;
          city?: string | null;
          bio?: string | null;
          is_active?: boolean;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
          public_slug?: string | null;
          full_name?: string;
          avatar_path?: string | null;
          phone?: string | null;
          city?: string | null;
          bio?: string | null;
          is_active?: boolean;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      provider_details: {
        Row: {
          profile_id: string;
          law_firm: string | null;
          years_experience: number | null;
          languages: string[] | null;
          subscription_status: Database["public"]["Enums"]["subscription_status"];
          subscription_expires_at: string | null;
          identity_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
          law_firm?: string | null;
          years_experience?: number | null;
          languages?: string[] | null;
          subscription_status?: Database["public"]["Enums"]["subscription_status"];
          subscription_expires_at?: string | null;
          identity_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          profile_id?: string;
          law_firm?: string | null;
          years_experience?: number | null;
          languages?: string[] | null;
          subscription_status?: Database["public"]["Enums"]["subscription_status"];
          subscription_expires_at?: string | null;
          identity_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      practice_areas: {
        Row: {
          id: string;
          slug: string;
          name: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          is_active?: boolean;
        };
        Relationships: [];
      };
      provider_practice_areas: {
        Row: {
          provider_id: string;
          practice_area_id: string;
        };
        Insert: {
          provider_id: string;
          practice_area_id: string;
        };
        Update: {
          provider_id?: string;
          practice_area_id?: string;
        };
        Relationships: [];
      };
      programs: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          is_active: boolean;
          config: Json;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          is_active?: boolean;
          config?: Json;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          is_active?: boolean;
          config?: Json;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          provider_id: string;
          program_id: string;
          practice_area_id: string | null;
          title: string;
          description: string | null;
          pricing_model: Database["public"]["Enums"]["pricing_model"];
          price_gel: number | null;
          is_published: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          program_id: string;
          practice_area_id?: string | null;
          title: string;
          description?: string | null;
          pricing_model?: Database["public"]["Enums"]["pricing_model"];
          price_gel?: number | null;
          is_published?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          provider_id?: string;
          program_id?: string;
          practice_area_id?: string | null;
          title?: string;
          description?: string | null;
          pricing_model?: Database["public"]["Enums"]["pricing_model"];
          price_gel?: number | null;
          is_published?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cases: {
        Row: {
          id: string;
          provider_id: string;
          practice_area_id: string | null;
          case_number: string;
          title: string;
          summary: string | null;
          public_decision_reference: string | null;
          decision_proof_path: string | null;
          requires_client_consent: boolean;
          consent_document_path: string | null;
          verification_status: Database["public"]["Enums"]["verification_status"];
          rejection_reason: string | null;
          verified_by: string | null;
          verified_at: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          practice_area_id?: string | null;
          case_number: string;
          title: string;
          summary?: string | null;
          public_decision_reference?: string | null;
          decision_proof_path?: string | null;
          requires_client_consent?: boolean;
          consent_document_path?: string | null;
          verification_status?: Database["public"]["Enums"]["verification_status"];
          rejection_reason?: string | null;
          verified_by?: string | null;
          verified_at?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          provider_id?: string;
          practice_area_id?: string | null;
          case_number?: string;
          title?: string;
          summary?: string | null;
          public_decision_reference?: string | null;
          decision_proof_path?: string | null;
          requires_client_consent?: boolean;
          consent_document_path?: string | null;
          verification_status?: Database["public"]["Enums"]["verification_status"];
          rejection_reason?: string | null;
          verified_by?: string | null;
          verified_at?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          client_id: string;
          provider_id: string;
          last_message_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          provider_id: string;
          last_message_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          provider_id?: string;
          last_message_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          attachment_path: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          attachment_path?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          body?: string;
          attachment_path?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          conversation_id: string | null;
          client_id: string;
          provider_id: string;
          service_id: string;
          status: Database["public"]["Enums"]["booking_status"];
          scheduled_at: string | null;
          price_gel: number | null;
          payment_status: Database["public"]["Enums"]["payment_status"];
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          conversation_id?: string | null;
          client_id: string;
          provider_id: string;
          service_id: string;
          status?: Database["public"]["Enums"]["booking_status"];
          scheduled_at?: string | null;
          price_gel?: number | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string | null;
          client_id?: string;
          provider_id?: string;
          service_id?: string;
          status?: Database["public"]["Enums"]["booking_status"];
          scheduled_at?: string | null;
          price_gel?: number | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          profile_id: string;
          purpose: Database["public"]["Enums"]["payment_purpose"];
          booking_id: string | null;
          amount_gel: number;
          status: string;
          gateway: string;
          gateway_ref: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          purpose: Database["public"]["Enums"]["payment_purpose"];
          booking_id?: string | null;
          amount_gel: number;
          status?: string;
          gateway: string;
          gateway_ref?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          purpose?: Database["public"]["Enums"]["payment_purpose"];
          booking_id?: string | null;
          amount_gel?: number;
          status?: string;
          gateway?: string;
          gateway_ref?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      expat_applications: {
        Row: {
          id: string;
          applicant_id: string;
          program_id: string;
          status: Database["public"]["Enums"]["application_status"];
          answers: Json;
          criteria_snapshot: Json;
          admin_notes: string | null;
          rejection_reason: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          applicant_id: string;
          program_id: string;
          status?: Database["public"]["Enums"]["application_status"];
          answers?: Json;
          criteria_snapshot?: Json;
          admin_notes?: string | null;
          rejection_reason?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          applicant_id?: string;
          program_id?: string;
          status?: Database["public"]["Enums"]["application_status"];
          answers?: Json;
          criteria_snapshot?: Json;
          admin_notes?: string | null;
          rejection_reason?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: "client" | "provider" | "admin";
      subscription_status: "trialing" | "active" | "past_due" | "inactive";
      verification_status: "pending" | "verified" | "rejected";
      booking_status: "pending_payment" | "confirmed" | "completed" | "cancelled";
      payment_status: "pending" | "succeeded" | "failed" | "refunded";
      payment_purpose: "provider_subscription" | "consultation_booking" | "other";
      pricing_model: "fixed" | "hourly" | "quote";
      application_status: "draft" | "submitted" | "under_review" | "accepted" | "rejected";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
