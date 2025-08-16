import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/browser";
import { api } from "./index";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyWebAuthAuthenticationResponse,
  VerifyWebAuthRegisterResponse,
} from "../../types";

export const getWebAuthRegisterOptions = async (username: string) => {
  return (
    await api.post("auth/register/options", {
      username,
    })
  ).data;
};

export const verifyWebAuthRegistration = async (
  username: string,
  options: RegistrationResponseJSON
): Promise<VerifyWebAuthRegisterResponse> => {
  return (await api.post(`auth/register/verify/${username}`, options)).data;
};

export const generateAuthenticationOptions = async (username: string) => {
  return (await api.post("auth/authenticate/options", { username })).data;
};

export const verifyAuthentication = async (
  username: string,
  options: AuthenticationResponseJSON
): Promise<VerifyWebAuthAuthenticationResponse> => {
  return (await api.post(`auth/authenticate/verify/${username}`, options)).data;
};

export const register = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => (await api.post("auth/register", payload)).data;

export const login = async (payload: LoginPayload): Promise<LoginResponse> =>
  (await api.post("auth/login", payload)).data;
