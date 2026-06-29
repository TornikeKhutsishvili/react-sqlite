import type { IUser } from "./user.interfaces";

export interface ILoginResponse {
  token: string;
  user: IUser;
}

export interface IAuthUser extends IUser {
  token: string;
}

export interface IRegisterPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}