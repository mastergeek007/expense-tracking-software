import { apiSlice } from "../api/apiSlice";

export const fundsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserRecentFundsTransactions: builder.query({
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
        return `/reports/user-funds?user=${email}&page=${page}&limit=${limit}&sort_by=${sort_by}&sort_order=${sort_order}&search=${search}&start_date=${start_date}&end_date=${end_date}`;
      },
      providesTags: ["Funds"],
    }),
    getUserFundLists: builder.query({
      query: ({
        email,
        sort_by = "_id",
        sort_order = "desc",
        search = "",
        start_date,
        end_date,
      }) => {
        return `/reports/user-funds?user=${email}&sort_by=${sort_by}&sort_order=${sort_order}&search=${search}&start_date=${start_date}&end_date=${end_date}`;
      },
      providesTags: ["Funds"],
    }),
    getUserCategoryFundLists: builder.query({
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
        return `/funds?category_name=${category}&user=${email}&page=${page}&limit=${limit}&sort_by=${sort_by}&sort_order=${sort_order}&search=${search}&start_date=${start_date}&end_date=${end_date}`;
      },
      providesTags: ["Funds"],
    }),
    deleteFund: builder.mutation({
      query: (id) => ({
        url: `/funds/delete?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Funds", "UserDetails", "Categories"],
    }),
    addFund: builder.mutation({
      query: (data) => ({
        url: "/funds",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Funds", "UserDetails", "Categories"],
    }),
    getSingleFund: builder.query({
      query: (id) => ({
        url: `/funds/details/${id}`,
        method: "GET",
      }),
      refetchOnMountOrArgChange: true,
      keepUnusedDataFor: 0,
    }),
    updateFund: builder.mutation({
      query: ({ id, data }) => ({
        url: `/funds/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Funds", "UserDetails", "Categories"],
    }),
  }),
});

export const {
  useLazyGetUserFundCategoriesQuery,
  useGetUserRecentFundsTransactionsQuery,
  useGetUserCategoryFundListsQuery,
  useDeleteFundMutation,
  useAddFundMutation,
  useGetUserFundListsQuery,
  useGetSingleFundQuery,
  useUpdateFundMutation,
} = fundsApi;
