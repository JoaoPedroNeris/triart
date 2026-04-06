export type UserRole = "admin" | "produtor" | "visitante";

export interface UserProfile {
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthContextType {
  user: { uid: string; email: string } | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}
