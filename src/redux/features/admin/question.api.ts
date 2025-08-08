import { baseApi } from "@/redux/api/baseApi";
import type { TQueryParam, TResponseRedux } from "@/types/global";
import type { TQuestion } from "@/types/question";

const questionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a question
    createQuestion: builder.mutation({
      query: (data) => ({
        url: "/questions",
        method: "POST",
        body: data,
      }),
    }),

    // Get all questions (with optional filters)
    getAllQuestions: builder.query<
      { data: TQuestion[]; meta: any },
      TQueryParam[] | undefined
    >({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/questions",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response: TResponseRedux<TQuestion[]>) => {
        return {
          data: response.data ?? [],
          meta: response.meta ?? {},
        };
      },
      providesTags: ["Questions"],
    }),

    // Get a single question
    getSingleQuestion: builder.query<TQuestion, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Questions", id }],
    }),

    // Update a question
    updateQuestion: builder.mutation({
      query: ({ id, data }: { id: string; data: Partial<TQuestion> }) => ({
        url: `/questions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Questions", id }],
    }),

    // Delete a question
    deleteQuestion: builder.mutation({
      query: (id: string) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),
  }),
});

export const {
  useCreateQuestionMutation,
  useGetAllQuestionsQuery,
  useGetSingleQuestionQuery,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionApi;
