import { baseApi } from "@/redux/api/baseApi";
import type { TCertificate } from "@/types/certificate";
import type { TResponseRedux } from "@/types/global";

const certificateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create Certificate
    createCertificate: builder.mutation({
      query: (data: Partial<TCertificate>) => ({
        url: "/certificates",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Certificates"],
    }),

    // ✅ Get Certificates by User
    getUserCertificates: builder.query<
      TCertificate[],
      { userId: string; currentStep?: number }
    >({
      query: ({ userId, currentStep }) => {
        const params = new URLSearchParams();
        if (currentStep !== undefined) {
          params.append("examStep", currentStep.toString());
        }
        return {
          url: `/certificates/user/${userId}`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response: TResponseRedux<TCertificate[]>) =>
        response.data ?? [],
      providesTags: ["Certificates"],
    }),

    // ✅ Send Certificate by Email
    sendCertificateByEmail: builder.mutation<
      { success: boolean; message: string },
      { id: string; email: string }
    >({
      query: ({ id, email }) => ({
        url: `/certificates/${id}/send-email`,
        method: "POST",
        body: { email },
      }),
      invalidatesTags: ["Certificates"],
    }),

    // ✅ Download Certificate PDF - Complete Solution
    downloadCertificateByPdf: builder.mutation<
      Blob, // Success response type
      string // Certificate ID parameter
    >({
      query: (id) => ({
        url: `certificates/${id}`,
        responseHandler: async (response) => {
          if (!response.ok) {
            // Handle error responses
            const error = await response.json();
            throw error;
          }
          return response.blob();
        },
        cache: "no-store",
      }),
      transformErrorResponse: (response) => {
        // Already parsed by responseHandler
        return response;
      },
      // Disable serialization check for this endpoint
      extraOptions: { serializable: false },
    }),
    // ✅ Delete Certificate
    deleteCertificate: builder.mutation({
      query: (id: string) => ({
        url: `/certificates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Certificates"],
    }),
  }),
});

export const {
  useCreateCertificateMutation,
  useGetUserCertificatesQuery,
  useSendCertificateByEmailMutation,
  useDownloadCertificateByPdfMutation,
  useDeleteCertificateMutation,
} = certificateApi;
