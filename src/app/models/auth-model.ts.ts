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

export interface ApiError {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
}
