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
    getUserCertificates: builder.query<TCertificate[], string>({
      query: (userId) => ({
        url: `/certificates/user/${userId}`,
        method: "GET",
      }),
      transformResponse: (response: TResponseRedux<TCertificate[]>) => {
        return response.data ?? [];
      },
      providesTags: ["Certificates"],
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
  useDeleteCertificateMutation,
} = certificateApi;
