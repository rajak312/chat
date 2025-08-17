import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export * from "./connections";
export * from "./messages";
export * from "./crypto";
