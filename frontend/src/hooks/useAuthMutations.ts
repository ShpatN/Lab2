import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { postLogin, postRegister } from "@/lib/authApi";
import type { LoginRequestBody, RegisterRequestBody } from "@/types/auth";

export function useLoginMutation() {
  const { applyAuthResponse } = useAuth();
  return useMutation({
    mutationFn: (body: LoginRequestBody) => postLogin(body),
    onSuccess: (data) => applyAuthResponse(data),
  });
}

export function useRegisterMutation() {
  const { applyAuthResponse } = useAuth();
  return useMutation({
    mutationFn: (body: RegisterRequestBody) => postRegister(body),
    onSuccess: (data) => applyAuthResponse(data),
  });
}
