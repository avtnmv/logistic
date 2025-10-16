export interface User {
  id: string;
  is_admin: boolean;
  avatar: string | null;
  phone: string;
  phone_verified_at: string | null;
  email: string | null;
  email_verified_at: string | null;
  first_name: string | null;
  last_name: string | null;
  registration_stage: 'PHONE_VERIFIED' | 'COMPLETED';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  last_login_at: string | null;
  meta: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
