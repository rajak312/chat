import { useMutation } from "@tanstack/react-query";
import {
  generateAuthenticationOptions,
  getWebAuthRegisterOptions,
  login,
  register,
  verifyAuthentication,
  verifyWebAuthRegistration,
} from "../request/auth";
import type { LoginPayload, RegisterPayload } from "../../types/auth";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { useToast } from "../../providers/ToastProvider";

export function useRegisterUserMutation() {
  const { showToast } = useToast();

  return useMutation({
    mutationKey: ["register"],
    mutationFn: (payload: RegisterPayload) => register(payload),
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Registration failed. Please try again.";
      showToast(message, "error");
      console.error("Registration failed:", error);
    },
  });
}

export function useLoginUserMutation() {
  const { showToast } = useToast();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: (payload: LoginPayload) => login(payload),
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Login failed. Please try again.";
      showToast(message, "error");
      console.error("Login failed:", error);
    },
  });
}

export function useRegisterPasskeyMutation() {
  const { showToast } = useToast();

  return useMutation({
    mutationKey: ["registerPassKey"],
    mutationFn: async (username: string) => {
      const optionsJSON = await getWebAuthRegisterOptions(username);
      const response = await startRegistration({ optionsJSON });
      return await verifyWebAuthRegistration(username, response);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Passkey registration failed.";
      showToast(message, "error");
      console.error("Passkey registration failed:", error);
    },
  });
}

export function useLoginWithPasskeyMutation() {
  const { showToast } = useToast();

  return useMutation({
    mutationKey: ["loginWithPassKey"],
    mutationFn: async (username: string) => {
      const optionsJSON = await generateAuthenticationOptions(username);
      const response = await startAuthentication({ optionsJSON });
      return verifyAuthentication(username, response);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Passkey login failed.";
      showToast(message, "error");
      console.error("Passkey login failed:", error);
    },
  });
}
