import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product } from '../Models/apiTypes';
import { API_URLS } from '../../config';

export const productAPI = createApi({
  reducerPath: 'productAPI',
  baseQuery: fetchBaseQuery({ baseUrl: API_URLS.depo }),
  endpoints: builder => ({
    getProductsByBarcode: builder.query<Product[], { barcode: string }>({
      query: ({ barcode }) => `/urunler?barcode=${barcode}`,
    }),
    getProductsByCode: builder.query<Product[], { code: string }>({
      query: ({ code }) => `/urunler?code=${code}`,
    }),
  }),
});

export const { useGetProductsByBarcodeQuery, useGetProductsByCodeQuery } = productAPI;
