// src/app/models/auth-model.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    fullName: string;
    email: string;
  };
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  birthDate: string; // yyyy-mm-dd
  city:string;
}

export interface RegisterResponse {
  id: number;
  user: {
    id: number;
    username: string;
    fullName: string;
    email: string;
  };
}

export interface UserSearch {
  id: number;
  userName: string;   // backend'deki JSON'la birebir aynı
  city: string | null;
}

export interface ApiError {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
}
