import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URLS } from '../../config';

export const sessionAPI = createApi({
  reducerPath: 'sessionAPI',
  baseQuery: fetchBaseQuery({ baseUrl: API_URLS.sayim }),
  endpoints: builder => ({
    // To get session user id and name
    getSession: builder.query<{ id: number; name: string }, void>({
      query: () => `/user_id.php`,
    }),
  }),
});

export const { useGetSessionQuery } = sessionAPI;
