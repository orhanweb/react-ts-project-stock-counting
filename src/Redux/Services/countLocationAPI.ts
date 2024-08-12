import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { StructureToCount, Corridor, SectionAndLevel, CountVariant, CountType, CountArea } from '../Models/apiTypes';
import { API_URLS } from '../../config';

// API tanımı
export const countLocationAPI = createApi({
  reducerPath: 'countLocationAPI',
  baseQuery: fetchBaseQuery({ baseUrl: API_URLS.depo }),
  tagTypes: ['Variants', 'CountType', 'Areas'], // Tag türlerini tanımla

  endpoints: builder => ({
    getStructuresToCount: builder.query<StructureToCount[], void>({
      query: () => `/depolar`,
    }),

    getCountVariants: builder.query<CountVariant[], void>({
      query: () => `/sayimTuru`,
      providesTags: ['Variants'], // Bu sorgu sonucunu Variants tag'i ile ilişkilendir
    }),

    getCountType: builder.query<CountType[], { variant: number }>({
      query: ({ variant }) => `/sayimTipi?id=${variant}`,
      providesTags: ['CountType'], // Bu sorgu sonucunu CountType tag'i ile ilişkilendir
    }),

    getCountArea: builder.query<CountArea[], void>({
      query: () => `/sayimAlani`,
      providesTags: ['Areas'],
    }),

    getStructure: builder.query<StructureToCount, { countID: string }>({
      query: args => {
        const formData = new FormData();
        formData.append('areaid', args.countID);
        return {
          url: '/alanlar',
          method: 'POST',
          body: formData,
        };
      },
    }),

    getCorridors: builder.query<Corridor[], { structureID: number }>({
      query: args => {
        const formData = new FormData();
        formData.append('areaid', args.structureID.toString());
        return {
          url: '/alanlar',
          method: 'POST',
          body: formData,
        };
      },
    }),

    getSectionAndLevel: builder.query<SectionAndLevel[], { zoneId: number }>({
      query: args => {
        const formData = new FormData();
        formData.append('zonesid', args.zoneId.toString());
        return {
          url: '/bolgeler',
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useGetStructuresToCountQuery,
  useGetCountVariantsQuery,
  useGetCountTypeQuery,
  useGetCountAreaQuery,
  useGetStructureQuery,
  useGetCorridorsQuery,
  useGetSectionAndLevelQuery,
} = countLocationAPI;
