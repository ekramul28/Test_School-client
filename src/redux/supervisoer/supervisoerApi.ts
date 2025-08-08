import { baseApi } from "@/redux/api/baseApi";
import type { TQueryParam, TResponseRedux } from "@/types/global";
import type { TSupervisor } from "@/types/supervisor";

const supervisorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSupervisors: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/supervisors",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["Supervisor"],
      transformResponse: (response: TResponseRedux<TSupervisor[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    getSingleSupervisor: builder.query({
      query: (id) => ({
        url: `/supervisors/${id}`,
        method: "GET",
      }),
      providesTags: ["Supervisor"],
      transformResponse: (response: TResponseRedux<TSupervisor>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),

    createSupervisor: builder.mutation({
      query: (data) => ({
        url: "/users/create-supervisor",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Supervisor"],
    }),

    updateSupervisor: builder.mutation({
      query: ({ id, data }) => ({
        url: `/supervisors/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Supervisor"],
    }),

    deleteSupervisor: builder.mutation({
      query: (id) => ({
        url: `/supervisors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Supervisor"],
    }),
  }),
});

export const {
  useGetAllSupervisorsQuery,
  useGetSingleSupervisorQuery,
  useCreateSupervisorMutation,
  useUpdateSupervisorMutation,
  useDeleteSupervisorMutation,
} = supervisorApi;
