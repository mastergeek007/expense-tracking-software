import { apiSlice } from "../api/apiSlice";

const createCategoryQuery = (endpoint) => ({
  query: ({ user, page, limit, search = "" }) => {
    const validPage = Math.max(1, parseInt(page));
    const validLimit = Math.max(1, Math.min(100, parseInt(limit)));

    const params = new URLSearchParams({
      user: user,
      page: validPage.toString(),
      limit: validLimit.toString(),
      search: search.trim(),
    });

    return {
      url: `${endpoint}?${params.toString()}`,
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
    };
  },
  providesTags: ["Categories"],
});

export const categoryAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserFundCategories: builder.query(
      createCategoryQuery("/categories/user-fund-categories")
    ),
    getUserCostCategories: builder.query(
      createCategoryQuery("/categories/user-cost-categories")
    ),
    createUserCategory: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetUserFundCategoriesQuery,
  useGetUserCostCategoriesQuery,
  useCreateUserCategoryMutation,
  useDeleteCategoryMutation,
} = categoryAPI;
