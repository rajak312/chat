export interface RegisterPayload {
  username: string;
  password: string;
  email?: string;
  phoneNumber?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface Response {
  message: string;
}

export interface RegisterResponse extends Response {}

export interface LoginResponse extends Response {}

export interface VerifyWebAuthRegisterResponse extends Response {
  verified: boolean;
}

export interface VerifyWebAuthAuthenticationResponse extends Response {}
