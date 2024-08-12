import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Person } from '../Models/apiTypes';
import { API_URLS } from '../../config';

export const userAPI = createApi({
  reducerPath: 'userAPI',
  baseQuery: fetchBaseQuery({ baseUrl: API_URLS.depotT }),
  endpoints: builder => ({
    // To get workers' details
    getWorkers: builder.query<{ [key: string]: Person }, void>({
      query: () => `/depotWorkers`,
      transformResponse: (response: any) => response.data.persons,
    }),
  }),
});

export const { useGetWorkersQuery } = userAPI;
