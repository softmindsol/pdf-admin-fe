/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_URL;

const createRequest = (url) => ({
  method: "GET",
  url,
});

const createPostRequest = (url, data) => ({
  method: "POST",
  url,
  body: JSON.stringify(data),
  headers: { "Content-Type": "application/json" },
});

const createDeleteRequest = (url) => ({
  method: "DELETE",
  url,
});

const createUpdateRequest = (url, data) => ({
  method: "PUT",
  url,
  body: JSON.stringify(data),
  headers: { "Content-Type": "application/json" },
});

const createPatchRequest = (url, data) => ({
  method: "PATCH",
  url,
  body: JSON.stringify(data),
  headers: { "Content-Type": "application/json" },
});

const coreBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const authtoken = localStorage.getItem("token");
    if (authtoken) {
      headers.set("Authorization", `Bearer ${authtoken}`);
    }
    return headers;
  },
});

const baseQueryWithAutoTokenSave = async (args, api, extraOptions) => {
  const result = await coreBaseQuery(args, api, extraOptions);

  if (result.data?.data?.token) {
    localStorage.setItem("token", result.data.data.token);
    localStorage.setItem("user_id", result.data.data.user_id);
    localStorage.setItem("role", result.data.data.role);
  }
  return result;
};

export const GlobalApi = createApi({
  reducerPath: "GlobalApi",
  baseQuery: baseQueryWithAutoTokenSave,

  tagTypes: ["User", "Department", "WorkOrder", "Customer"], // Added "Customer" TagType
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => createPostRequest(`/auth/login`, body),
    }),

    createUser: builder.mutation({
      query: (body) => createPostRequest(`/admin/user`, body),
      invalidatesTags: ["User", "Department"],
    }),

    getUsers: builder.query({
      query: ({
        department,
        page = 1,
        limit = 10,
        search,
        role,
        isDeleted = false,
      }) => {
        const params = new URLSearchParams({
          page,
          limit,
          isDeleted,
          ...(department && { department }),
          ...(search && { search }),
          ...(role && { role }),
        });
        return createRequest(`/admin/user?${params.toString()}`);
      },
      providesTags: ["User"],
    }),

    getUserById: builder.query({
      query: (id) => createRequest(`/admin/user/${id}`),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...body }) => createPatchRequest(`/admin/user/${id}`, body),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => createDeleteRequest(`/admin/user/${id}`),
      invalidatesTags: ["User"],
    }),
    getDepartments: builder.query({
      query: ({ page = 1, limit = 10, search, isDeleted = false }) => {
        const params = new URLSearchParams({
          page,
          limit,
          isDeleted,
          ...(search && { search }),
        });
        return createRequest(`/admin/department?${params.toString()}`);
      },
      providesTags: ["Department"],
    }),

    getDepartmentById: builder.query({
      query: (id) => createRequest(`/admin/department/${id}`),
      providesTags: (result, error, id) => [{ type: "Department", id }],
    }),

    updateDepartment: builder.mutation({
      query: ({ id, ...body }) =>
        createPatchRequest(`/admin/department/${id}`, body),
      invalidatesTags: ["Department"],
    }),

    forms: builder.query({
      query: () => createRequest(`/admin/department/forms`),
      invalidatesTags: [""],
    }),

    // WorkOrder Endpoints
    createWorkOrder: builder.mutation({
      query: (body) => createPostRequest(`/admin/work-order`, body),
      invalidatesTags: ["WorkOrder"],
    }),
    getWorkOrders: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search,
        customerName,
        jobNumber,
        technicianName,
      }) => {
        const params = new URLSearchParams({
          page,
          limit,
          ...(search && { search }),
          ...(customerName && { customerName }),
          ...(jobNumber && { jobNumber }),
          ...(technicianName && { technicianName }),
        });
        return createRequest(`/admin/work-order?${params.toString()}`);
      },
      providesTags: ["WorkOrder"],
    }),
    getWorkOrderById: builder.query({
      query: (id) => createRequest(`/admin/work-order/${id}`),
      providesTags: (result, error, id) => [{ type: "WorkOrder", id }],
    }),
    updateWorkOrder: builder.mutation({
      query: ({ id, ...body }) =>
        createPatchRequest(`/admin/work-order/${id}`, body),
      invalidatesTags: ["WorkOrder"],
    }),
    deleteWorkOrder: builder.mutation({
      query: (id) => createDeleteRequest(`/admin/work-order/${id}`),
      invalidatesTags: ["WorkOrder"],
    }),

    // Customer Endpoints
    createCustomer: builder.mutation({
      query: (body) => createPostRequest(`/admin/customer-ticket`, body),
      invalidatesTags: ["Customer"],
    }),
    getCustomers: builder.query({
      query: ({ page = 1, limit = 10, search }) => {
        const params = new URLSearchParams({
          page,
          limit,
          ...(search && { search }),
        });
        return createRequest(`/admin/customer-ticket?${params.toString()}`);
      },
      providesTags: ["Customer"],
    }),
    getCustomerById: builder.query({
      query: (id) => createRequest(`/admin/customer-ticket/${id}`),
      providesTags: (result, error, id) => [{ type: "Customer", id }],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, ...body }) =>
        createPatchRequest(`/admin/customer-ticket/${id}`, body),
      invalidatesTags: ["Customer"],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => createDeleteRequest(`/admin/customer-ticket/${id}`),
      invalidatesTags: ["Customer"],
    }),
    // Above Ground Test
    createAboveGroundTest: builder.mutation({
      query: (body) => createPostRequest(`/admin/above-ground`, body),
      invalidatesTags: ["AboveGroundTest"],
    }),
    getAboveGroundTests: builder.query({
      query: ({ page = 1, limit = 10, search }) => {
        const params = new URLSearchParams({
          page,
          limit,
          ...(search && { search }),
        });
        return createRequest(`/admin/above-ground?${params.toString()}`);
      },
      providesTags: ["AboveGroundTest"],
    }),
    getAboveGroundTestById: builder.query({
      query: (id) => createRequest(`/admin/above-ground/${id}`),
      providesTags: (result, error, id) => [{ type: "AboveGroundTest", id }],
    }),
    updateAboveGroundTest: builder.mutation({
      query: ({ id, ...body }) =>
        createPatchRequest(`/admin/above-ground/${id}`, body),
      invalidatesTags: ["AboveGroundTest"],
    }),
    deleteAboveGroundTest: builder.mutation({
      query: (id) => createDeleteRequest(`/admin/above-ground/${id}`),
      invalidatesTags: ["AboveGroundTest"],
    }),
  }),
});

export const {
  useLoginMutation,
  useCreateUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useUpdateDepartmentMutation,
  useFormsQuery,
  useCreateWorkOrderMutation,
  useGetWorkOrdersQuery,
  useGetWorkOrderByIdQuery,
  useUpdateWorkOrderMutation,
  useDeleteWorkOrderMutation,
  // Export new customer hooks
  useCreateCustomerMutation,
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,

  //  Above Ground Test,
  useCreateAboveGroundTestMutation,
  useGetAboveGroundTestsQuery,
  useGetAboveGroundTestByIdQuery,
  useUpdateAboveGroundTestMutation,
  useDeleteAboveGroundTestMutation,
} = GlobalApi;
