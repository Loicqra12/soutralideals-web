import apiClient from "./client";

export async function sendOtp(telephone: string) {
  const { data } = await apiClient.post<{
    success: boolean;
    message: string;
    telephone: string;
    expiresInSeconds: number;
    devMode?: boolean;
    devCode?: string;
  }>("/otp/send", { telephone });
  return data;
}

export async function verifyOtp(telephone: string, code: string) {
  const { data } = await apiClient.post<{
    success: boolean;
    phoneVerificationToken: string;
    telephone: string;
  }>("/otp/verify", { telephone, code });
  return data;
}
