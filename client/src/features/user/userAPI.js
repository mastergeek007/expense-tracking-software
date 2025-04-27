import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserDetails: builder.query({
      query: (email) => `/user-details?user=${email}`,
      providesTags: ["UserDetails"],
    }),
    getUserYearDetails: builder.query({
      query: ({ email, year = new Date().getFullYear() }) => {
        const yearNum = parseInt(year);
        if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
          throw new Error("Invalid year");
        }
        return `/user-details-year?user=${email}&year=${yearNum}`;
      },
      providesTags: ["UserDetails"],
    }),
    getUserMonthWiseDetails: builder.query({
      query: ({ email, year = new Date().getFullYear(), month }) => {
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);
        if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
          throw new Error("Invalid year");
        }
        return `/user-details-month?user=${email}&year=${yearNum}&month=${monthNum}`;
      },
      providesTags: ["UserDetails"],
    }),
  }),
});

export const { useGetUserDetailsQuery, useGetUserYearDetailsQuery, useGetUserMonthWiseDetailsQuery } = userApi;
