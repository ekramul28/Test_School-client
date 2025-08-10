import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/register",
        method: "POST",
        body: userInfo,
      }),
    }),
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: "/auth/change-password",
        method: "POST",
        body: passwordData,
      }),
    }),
    refreshToken: builder.mutation({
      query: (tokenData) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body: tokenData,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (emailData) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: emailData,
      }),
    }),
    resetPassword: builder.mutation({
      query: (resetData) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: resetData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useChangePasswordMutation,
  useRefreshTokenMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
} = authApi;
