// countFormAPI.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  StructureToCount,
  CountVariant,
  CountType,
  CountArea,
  CountFormData,
  CountInterface,
  AddProductToCount,
  ViewCounted,
  CountedExcel,
} from '../Models/apiTypes';
import { API_URLS } from '../../config';

export const countFormAPI = createApi({
  reducerPath: 'countFormAPI',
  baseQuery: fetchBaseQuery({ baseUrl: API_URLS.depo }),
  tagTypes: ['Variants', 'CountType', 'Areas', 'CountList', 'Structures', 'CountedProductList'], // Define tag types
  endpoints: builder => ({
    // --- To get all counts
    getCountList: builder.query<CountInterface[], void>({
      query: () => `/countList`,
      providesTags: ['CountList'],
    }),

    // --- To get details for a specific count
    getCountDetails: builder.query<CountInterface, { countID?: string }>({
      query: ({ countID }) => `/countList?sayim_id=${countID}`,
      transformResponse: (response: CountInterface[]) => response[0],
    }),

    // --- To get counted product and more for a specific count
    getViewCounted: builder.query<ViewCounted, { countID?: string }>({
      query: ({ countID }) => `/count_trans_list?sayim_id=${countID}`,
      providesTags: ['CountedProductList'],
    }),

    // --- To get counted product and more for a specific count
    getProductsForExcel: builder.query<CountedExcel[], { countID?: string }>({
      query: ({ countID }) => `/count_rapor?sayim_id=${countID}`,
      providesTags: ['CountedProductList'],
    }),

    // --- To get structures (warehouses markets and more)
    getStructuresToCount: builder.query<StructureToCount[], void>({
      query: () => `/depolar`,
      providesTags: ['Structures'],
    }),

    // --- To get count variants
    getCountVariants: builder.query<CountVariant[], void>({
      query: () => `/sayimTuru`,
      providesTags: ['Variants'],
    }),

    // --- To get count types
    getCountType: builder.query<CountType[], { variant: number }>({
      query: ({ variant }) => `/sayimTipi?id=${variant}`,
      providesTags: ['CountType'],
    }),

    // --- To get count areas
    getCountArea: builder.query<CountArea[], void>({
      query: () => `/sayimAlani`,
      providesTags: ['Areas'],
    }),

    // --- To start a count
    startCount: builder.mutation<void, { countId: number; status: string }>({
      query: ({ countId, status }) => ({
        url: `/count_status?countId=${countId}&status=${status}`,
        method: 'POST', // PUT or PATCH
      }),
      invalidatesTags: ['CountList'],
    }),

    // --- To end a count
    endCount: builder.mutation<void, { countId: number; status: string }>({
      query: ({ countId, status }) => ({
        url: `/count_status?countId=${countId}&status=${status}`,
        method: 'POST', // PUT or PATCH
      }),
      invalidatesTags: ['CountList'],
    }),

    // --- To "delete" (lock) a count
    lockCount: builder.mutation<void, { countId: number }>({
      query: ({ countId }) => ({
        url: `/count_delete?countId=${countId}`,
        method: 'POST', // PUT or PATCH
      }),
      invalidatesTags: ['CountList'],
    }),

    // --- To "delete" (lock) a counted product
    deleteCountedProduct: builder.mutation<void, { trans_id: number; user_id: number }>({
      query: ({ trans_id, user_id }) => ({
        url: `/count_trans_status?trans_id=${trans_id}&user_id=${user_id}`, // Burayı değiştir.
        method: 'POST', // PUT or PATCH
      }),
      invalidatesTags: ['CountedProductList'],
    }),

    // --- To update count dates
    updateCountDates: builder.mutation<void, { countId: number; startDate?: string; endDate?: string }>({
      query: ({ countId, startDate, endDate }) => ({
        url: `/count_date`,
        method: 'POST',
        body: JSON.stringify({
          countId: countId,
          ...(startDate ? { baslangic: startDate } : {}), // If there is a start date, send it
          ...(endDate ? { bitis: endDate } : {}), // Send if there is an end date
        }),
      }),
      invalidatesTags: ['CountList'],
    }),

    // --- To add a new count
    addCountForm: builder.mutation<void, CountFormData>({
      query: formData => ({
        url: '/save',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Variants', 'CountType', 'Areas', 'CountList'],
    }),

    // --- To add a new count
    addProductToCount: builder.mutation<void, AddProductToCount>({
      query: formData => ({
        url: '/count_trans',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['CountedProductList'],
    }),
  }),
});

export const {
  useGetCountListQuery,
  useGetCountDetailsQuery,
  useGetViewCountedQuery,
  useLazyGetProductsForExcelQuery,
  useGetStructuresToCountQuery,
  useGetCountVariantsQuery,
  useGetCountTypeQuery,
  useGetCountAreaQuery,
  useAddCountFormMutation,
  useStartCountMutation,
  useEndCountMutation,
  useLockCountMutation,
  useDeleteCountedProductMutation,
  useUpdateCountDatesMutation,
  useAddProductToCountMutation,
} = countFormAPI;
