import axios from "axios";
import apiClient from "./client";

function extractErrorMessage(e: unknown, fallback: string): string {
  if (axios.isAxiosError(e)) {
    const msg =
      e.response?.data?.error ??
      e.response?.data?.message ??
      e.response?.data;
    if (typeof msg === "string" && msg.length > 0) return msg;
  }
  if (e instanceof Error) return e.message;
  return fallback;
}

export async function sendOtp(telephone: string) {
  try {
    const { data } = await apiClient.post<{
      success: boolean;
      message: string;
      telephone: string;
      expiresInSeconds: number;
      devMode?: boolean;
      devCode?: string;
    }>("/otp/send", { telephone });
    return data;
  } catch (e) {
    const msg = extractErrorMessage(
      e,
      "Envoi du code SMS impossible. Vérifiez votre numéro.",
    );
    throw new Error(msg);
  }
}

export async function verifyOtp(telephone: string, code: string) {
  try {
    const { data } = await apiClient.post<{
      success: boolean;
      phoneVerificationToken: string;
      telephone: string;
    }>("/otp/verify", { telephone, code });
    return data;
  } catch (e) {
    throw new Error(extractErrorMessage(e, "Code incorrect ou expiré."));
  }
}
