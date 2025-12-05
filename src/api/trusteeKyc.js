import useSWR from 'swr';
import { useEffect, useMemo } from 'react';
import { fetcher, endpoints } from 'src/utils/axios';

export function useGetKycProgress(userId, stepperId) {
  const URL =
    userId && stepperId
      ? endpoints.trusteeKyc.kycProgress(userId, stepperId)
      : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  return useMemo(
    () => ({
      kycProgress: data || null,
      profileId: data?.profile?.id || null,
      loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, isLoading, error, isValidating]
  );
}


export function useGetKycSection(stepperId, userId, route = '') {
  const URL =
    stepperId && userId
      ? endpoints.trusteeKyc.getSection(stepperId, userId, route)
      : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  return {
    kycSectionData: data || null,
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && !data,
  };
}


export function useGetDetails(userId, stepperId) {
  const URL =
    userId && stepperId
      ? endpoints.trusteeKyc.getSection(stepperId, userId, '')
      : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  return {
    Details: data?.data?.[0] || null,
    rawData: data,
    Loading: isLoading,
    Error: error,
    Validating: isValidating,
    Empty: !isLoading && !data?.data?.length,
  };
}

export function useGetSignatories(userId, stepperId) {
  const URL =
    userId && stepperId
      ? endpoints.trusteeKyc.getSection(stepperId, userId, '')
      : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshSignatories = () => {
    mutate(); // <-- trigger re-fetch
  };

  return {
    signatories: data?.data || [],   // <-- ALWAYS ARRAY
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.data || data.data.length === 0),
    refreshSignatories,
  };
}

