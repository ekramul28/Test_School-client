import { baseApi } from "@/redux/api/baseApi";
import type { TExam } from "@/types/examApi";
import type { TResponseRedux, TQueryParam } from "@/types/global";

const examApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create Exam
    createExam: builder.mutation({
      query: (data: Partial<TExam>) => ({
        url: "/exams",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Exams"],
    }),

    // ✅ Get Exams by User
    getExamsByUser: builder.query<TExam[], string>({
      query: (userId) => ({
        url: `/exams/user/${userId}`,
        method: "GET",
      }),
      transformResponse: (response: TResponseRedux<TExam[]>) => {
        return response.data ?? [];
      },
      providesTags: ["Exams"],
    }),

    // ✅ Get Exam by User and Step
    getExamByUserAndStep: builder.query<
      TExam,
      { userId: string; step: number }
    >({
      query: ({ userId, step }) => ({
        url: `/exams/user/${userId}/step/${step}`,
        method: "GET",
      }),
      providesTags: ["Exams"],
    }),

    // ✅ Update Exam
    updateExam: builder.mutation({
      query: ({ id, data }: { id: string; data: Partial<TExam> }) => ({
        url: `/exams/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Exams"],
    }),

    // ✅ Delete Exam
    deleteExam: builder.mutation({
      query: (id: string) => ({
        url: `/exams/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Exams"],
    }),
  }),
});

export const {
  useCreateExamMutation,
  useGetExamsByUserQuery,
  useGetExamByUserAndStepQuery,
  useUpdateExamMutation,
  useDeleteExamMutation,
} = examApi;
