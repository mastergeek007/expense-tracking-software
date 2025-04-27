import { apiSlice } from "../api/apiSlice";

export const costsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserRecentCostsTransactions: builder.query({
      query: ({
        email,
        page = 1,
        limit = 100,
        sort_by = "_id",
        sort_order = "desc",
        search = "",
        start_date,
        end_date,
      }) => {
        return `/reports/user-costs?user=${email}&page=${page}&limit=${limit}&sort_by=${sort_by}&sort_order=${sort_order}&search=${search}&start_date=${start_date}&end_date=${end_date}`;
      },
      providesTags: ["Costs"],
    }),
    getUserCostLists: builder.query({
      query: ({
        email,
        sort_by = "_id",
        sort_order = "desc",
        search = "",
        start_date,
        end_date,
      }) => {
        return `/reports/user-costs?user=${email}&sort_by=${sort_by}&sort_order=${sort_order}&search=${search}&start_date=${start_date}&end_date=${end_date}`;
      },
      providesTags: ["Costs"],
    }),
    getUserCategoryCostLists: builder.query({
      query: ({
        email,
        category,
        page = 1,
        limit = 100,
        sort_by = "_id",
        sort_order = "desc",
        search = "",
        start_date,
        end_date,
      }) => {
        return `/costs?category_name=${category}&user=${email}&page=${page}&limit=${limit}&sort_by=${sort_by}&sort_order=${sort_order}&search=${search}&start_date=${start_date}&end_date=${end_date}`;
      },
      providesTags: ["Costs"],
    }),
    deleteCost: builder.mutation({
      query: (id) => ({
        url: `/costs/delete?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Costs", "UserDetails", "Categories"],
    }),
    addCost: builder.mutation({
      query: (data) => ({
        url: "/costs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Costs", "UserDetails", "Categories"],
    }),
    createUserCostCategory: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Costs", "UserDetails", "Categories"],
    }),
    getSingleCost: builder.query({
      query: (id) => ({
        url: `/costs/details/${id}`,
        method: "GET",
      }),
      refetchOnMountOrArgChange: true,
      keepUnusedDataFor: 0,
    }),
    updateCost: builder.mutation({
      query: ({ id, data }) => ({
        url: `/costs/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Costs", "UserDetails", "Categories"],
    }),
  }),
});

export const {
  useAddCostMutation,
  useGetUserRecentCostsTransactionsQuery,
  useGetUserCategoryCostListsQuery,
  useDeleteCostMutation,
  useCreateUserCostCategoryMutation,
  useGetUserCostListsQuery,
  useGetSingleCostQuery,
  useUpdateCostMutation,
} = costsApi;
