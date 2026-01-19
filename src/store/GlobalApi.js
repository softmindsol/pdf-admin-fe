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
  if (
    result.error &&
    (result.error.status === 403 || result.error.status === 401)
  ) {
    console.error("Authorization error, logging out user.", result.error);

    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");

    const formattedErrorMessage = String(result?.error?.data?.message)
      .toLowerCase()
      .replace(/ /g, "-");
    window.location.href = `/auth/login?error=${formattedErrorMessage}`;
  }
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

  tagTypes: ["User", "Department", "WorkOrder", "Customer", "latestTickets", "Alarm"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => createPostRequest(`/auth/login`, body),
      invalidatesTags: ["latestTickets"],
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
      providesTags: (result, error, id) => [{ type: "User", id }, "User"],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...body }) => createPatchRequest(`/admin/user/${id}`, body),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }, "User"],
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
      providesTags: (result, error, id) => [{ type: "Department", id }, "Department"],
    }),

    createDepartment: builder.mutation({
      query: (body) => createPostRequest(`/admin/department`, body),
      invalidatesTags: ["Department"],
    }),

    updateDepartment: builder.mutation({
      query: ({ id, ...body }) =>
        createPatchRequest(`/admin/department/${id}`, body),
      invalidatesTags: (result, error, arg) => [{ type: "Department", id: arg.id }, "Department"],
    }),

    deleteDepartment: builder.mutation({
      query: (id) => createDeleteRequest(`/admin/department/${id}`),
      invalidatesTags: ["Department"],
    }),

    forms: builder.query({
      query: () => createRequest(`/admin/department/forms`),
      invalidatesTags: [""],
    }),

    createWorkOrder: builder.mutation({
      query: (body) => createPostRequest(`/admin/work-order`, body),
      invalidatesTags: ["WorkOrder", "latestTickets"],
    }),

    getWorkOrders: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search,
        customerName,
        jobNumber,
        technicianName,
        department,

        startDate,
        endDate,
      }) => {
        const params = new URLSearchParams({
          page,
          limit,
          ...(search && { search }),
          ...(customerName && { customerName }),
          ...(jobNumber && { jobNumber }),
          ...(technicianName && { technicianName }),
          ...(department && { department }),

          ...(startDate && { "createdAt[gte]": startDate }),
          ...(endDate && { "createdAt[lte]": endDate }),
        });
        return createRequest(`/admin/work-order?${params.toString()}`);
      },
      providesTags: ["WorkOrder"],
    }),
    getWorkOrderById: builder.query({
      query: (id) => createRequest(`/admin/work-order/${id}`),
      providesTags: (result, error, id) => [{ type: "WorkOrder", id }, "WorkOrder"],
    }),
    updateWorkOrder: builder.mutation({
      query: ({ id, ...body }) =>
        createPatchRequest(`/admin/work-order/${id}`, body),
      invalidatesTags: (result, error, arg) => [{ type: "WorkOrder", id: arg.id }, "WorkOrder"],
    }),
    deleteWorkOrder: builder.mutation({
      query: (id) => createDeleteRequest(`/admin/work-order/${id}`),
      invalidatesTags: ["WorkOrder"],
    }),

    createCustomer: builder.mutation({
      query: (body) => createPostRequest(`/admin/customer-ticket`, body),
      invalidatesTags: ["Customer", 'latestTickets'],
    }),

    getCustomers: builder.query({
      query: (args) => {
        const queryParams = {};
        Object.entries(args).forEach(([key, value]) => {
          if (value) {
            if (key === "startDate") {
              queryParams["createdAt[gte]"] = value;
            } else if (key === "endDate") {
              queryParams["createdAt[lte]"] = value;
            } else {
              queryParams[key] = value;
            }
          }
        });

        if (!queryParams.page) queryParams.page = 1;
        if (!queryParams.limit) queryParams.limit = 10;

        const params = new URLSearchParams(queryParams);

        return createRequest(`/admin/customer-ticket?${params.toString()}`);
      },
      providesTags: ["Customer"],
    }),
    getCustomerById: builder.query({
      query: (id) => createRequest(`/admin/customer-ticket/${id}`),
      providesTags: (result, error, id) => [{ type: "Customer", id }, "Customer"],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, ...body }) =>
        createPatchRequest(`/admin/customer-ticket/${id}`, body),
      invalidatesTags: (result, error, arg) => [{ type: "Customer", id: arg.id }, "Customer"],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => createDeleteRequest(`/admin/customer-ticket/${id}`),
      invalidatesTags: ["Customer"],
    }),

    createAboveGroundTest: builder.mutation({
      query: (body) => createPostRequest(`/admin/above-ground`, body),
      invalidatesTags: ["AboveGroundTest", 'latestTickets'],
    }),

    getAboveGroundTests: builder.query({
      query: (args) => {
        const queryParams = {};
        Object.entries(args).forEach(([key, value]) => {
          if (value) {
            if (key === "startDate") {
              queryParams["createdAt[gte]"] = value;
            } else if (key === "endDate") {
              queryParams["createdAt[lte]"] = value;
            } else {
              queryParams[key] = value;
            }
          }
        });

        if (!queryParams.page) queryParams.page = 1;
        if (!queryParams.limit) queryParams.limit = 10;

        const params = new URLSearchParams(queryParams);
        return createRequest(`/admin/above-ground?${params.toString()}`);
      },
      providesTags: ["AboveGroundTest"],
    }),
    getAboveGroundTestById: builder.query({
      query: (id) => createRequest(`/admin/above-ground/${id}`),
      providesTags: (result, error, id) => [{ type: "AboveGroundTest", id }, "AboveGroundTest"],
    }),
    updateAboveGroundTest: builder.mutation({
      query: ({ id, ...body }) =>
        createPatchRequest(`/admin/above-ground/${id}`, body),
      invalidatesTags: (result, error, arg) => [{ type: "AboveGroundTest", id: arg.id }, "AboveGroundTest"],
    }),
    deleteAboveGroundTest: builder.mutation({
      query: (id) => createDeleteRequest(`/admin/above-ground/${id}`),
      invalidatesTags: ["AboveGroundTest"],
    }),
    createServiceTicket: builder.mutation({
      query: (body) => createPostRequest(`/admin/service-ticket`, body),
      invalidatesTags: ["ServiceTicket", 'latestTickets'],
    }),

    getServiceTickets: builder.query({
      query: (args) => {
        const queryParams = {};
        Object.entries(args).forEach(([key, value]) => {
          if (value) {
            if (key === "startDate") {
              queryParams["createdAt[gte]"] = value;
            } else if (key === "endDate") {
              queryParams["createdAt[lte]"] = value;
            } else {
              queryParams[key] = value;
            }
          }
        });

        if (!queryParams.page) queryParams.page = 1;
        if (!queryParams.limit) queryParams.limit = 10;

        const params = new URLSearchParams(queryParams);
        return createRequest(`/admin/service-ticket?${params.toString()}`);
      },
      providesTags: ["ServiceTicket"],
    }),
    getServiceTicketById: builder.query({
      query: (id) => createRequest(`/admin/service-ticket/${id}`),
      providesTags: (result, error, id) => [{ type: "ServiceTicket", id }, "ServiceTicket"],
    }),
    updateServiceTicket: builder.mutation({
      query: ({ id, ...body }) =>
        createPatchRequest(`/admin/service-ticket/${id}`, body),
      invalidatesTags: (result, error, arg) => [{ type: "ServiceTicket", id: arg.id }, "ServiceTicket"],
    }),
    deleteServiceTicket: builder.mutation({
      query: (id) => createDeleteRequest(`/admin/service-ticket/${id}`),
      invalidatesTags: ["ServiceTicket"],
    }),

    createUndergroundTest: builder.mutation({
      query: (body) => createPostRequest(`/admin/under-ground`, body),
      invalidatesTags: ["UndergroundTest", 'latestTickets'],
    }),

    getUndergroundTests: builder.query({
      query: (args) => {
        const queryParams = {};
        Object.entries(args).forEach(([key, value]) => {
          if (value) {
            if (key === "startDate") {
              queryParams["createdAt[gte]"] = value;
            } else if (key === "endDate") {
              queryParams["createdAt[lte]"] = value;
            } else {
              queryParams[key] = value;
            }
          }
        });

        if (!queryParams.page) queryParams.page = 1;
        if (!queryParams.limit) queryParams.limit = 10;

        const params = new URLSearchParams(queryParams);
        return createRequest(`/admin/under-ground?${params.toString()}`);
      },
      providesTags: ["UndergroundTest"],
    }),
    getUndergroundTestById: builder.query({
      query: (id) => createRequest(`/admin/under-ground/${id}`),
      providesTags: (result, error, id) => [{ type: "UndergroundTest", id }, "UndergroundTest"],
    }),
    updateUndergroundTest: builder.mutation({
      query: ({ id, ...body }) =>
        createPatchRequest(`/admin/under-ground/${id}`, body),
      invalidatesTags: (result, error, arg) => [{ type: "UndergroundTest", id: arg.id }, "UndergroundTest"],
    }),
    deleteUndergroundTest: builder.mutation({
      query: (id) => createDeleteRequest(`/admin/under-ground/${id}`),
      invalidatesTags: ["UndergroundTest"],
    }),
    getSignedUrl: builder.query({
      query: (key) => {
        const params = new URLSearchParams({ key });

        return createRequest(`/file/pre-sign?${params.toString()}`);
      },
    }),
    changePassword: builder.mutation({
      query: (body) => createPostRequest(`/auth/change-password`, body),
    }),

    changeUsername: builder.mutation({
      query: (body) => createPostRequest(`/auth/change-username`, body),
    }),
    latestTickets: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        createRequest(`/ticket/synced?page=${page}&limit=${limit}`),
      providesTags: ["latestTickets"],
    }),

    // ... after deleteCustomer endpoint

    createAlarm: builder.mutation({
      query: (body) => createPostRequest(`/admin/alarm`, body),
      invalidatesTags: ["Alarm", 'latestTickets'],
    }),

    getAlarms: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search,
        department,
        dealerCode,
        accountNumber,
        startDate,
        endDate,
      }) => {
        const params = new URLSearchParams({
          page,
          limit,
          ...(search && { search }),
          ...(department && { department }),
          ...(dealerCode && { dealerCode }),
          ...(accountNumber && { accountNumber }),
          ...(startDate && { "createdAt[gte]": startDate }), // Filter by creation date range
          ...(endDate && { "createdAt[lte]": endDate }),
        });
        return createRequest(`/admin/alarm?${params.toString()}`);
      },
      providesTags: ["Alarm"],
    }),

    getAlarmById: builder.query({
      query: (id) => createRequest(`/admin/alarm/${id}`),
      providesTags: (result, error, id) => [{ type: "Alarm", id }, "Alarm"],
    }),

    updateAlarm: builder.mutation({
      query: ({ id, ...body }) =>
        createPatchRequest(`/admin/alarm/${id}`, body),
      invalidatesTags: (result, error, arg) => [{ type: "Alarm", id: arg.id }, "Alarm"],
    }),

    deleteAlarm: builder.mutation({
      query: (id) => createDeleteRequest(`/admin/alarm/${id}`),
      invalidatesTags: ["Alarm"],
    }),

    // ... other endpoints like createAboveGroundTest
    // ...

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
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useFormsQuery,

  useCreateWorkOrderMutation,
  useGetWorkOrdersQuery,
  useGetWorkOrderByIdQuery,
  useUpdateWorkOrderMutation,
  useDeleteWorkOrderMutation,

  useCreateCustomerMutation,
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,

  useCreateAboveGroundTestMutation,
  useGetAboveGroundTestsQuery,
  useGetAboveGroundTestByIdQuery,
  useUpdateAboveGroundTestMutation,
  useDeleteAboveGroundTestMutation,

  useCreateUndergroundTestMutation,
  useGetUndergroundTestsQuery,
  useGetUndergroundTestByIdQuery,
  useUpdateUndergroundTestMutation,
  useDeleteUndergroundTestMutation,

  useCreateServiceTicketMutation,
  useGetServiceTicketsQuery,
  useGetServiceTicketByIdQuery,
  useUpdateServiceTicketMutation,
  useDeleteServiceTicketMutation,
  useGetSignedUrlQuery,
  useLazyGetSignedUrlQuery,
  useChangePasswordMutation,
  useChangeUsernameMutation,
  useLatestTicketsQuery,
  useCreateAlarmMutation,
  useGetAlarmsQuery,
  useGetAlarmByIdQuery,
  useUpdateAlarmMutation,
  useDeleteAlarmMutation,
} = GlobalApi;
