import { baseApi } from "@/redux/baseApi";



export const divisionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addDivision: builder.mutation({
            query: (divisionData) => ({
                url: "/division/create",
                method: "POST",
                data: divisionData,
            }),
            invalidatesTags: ["TOUR"],
        }),

        getDivision: builder.query({
            query: () => ({
                url: "/division",
                method: "GET",
            }),
            providesTags: ["TOUR"],
            transformResponse: (response) => response.data
        }),
    }),
});

export const {
useAddDivisionMutation,
useGetDivisionQuery
} = divisionApi;