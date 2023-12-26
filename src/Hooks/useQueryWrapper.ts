// src/hooks/useQueryWrapper.ts

export const useQueryWrapper = (queryHook: any, queryArg: any, skip: boolean) => {
    const { data, isFetching } = queryHook(queryArg, { skip });
    return { data, isFetching };
};
  