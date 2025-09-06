export interface UserDto {
  id: number;
  userName: string;
  email: string;
  city: string;
  birthDate: string;   // ISO ya da "YYYY-MM-DD" string
  status: boolean;
  firstName: string;
  lastName: string;
}

export interface UserUpdateDto {
  id: number;
  userName: string;
  email: string;
  city: string;
  birthDate: string;   // ISO string göndereceğiz
  status: boolean;
  firstName: string;
  lastName: string;
}
export interface UserProfileUpdateDto {
  userName: string;
  email: string;
  city: string;
  birthDate: string;   // "YYYY-MM-DD" gönder
  firstName: string;
  lastName: string;
}
