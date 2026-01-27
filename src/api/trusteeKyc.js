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

export function useGetAddressDetails(trusteeId) {
  const URL = trusteeId
    ? endpoints.trusteeKyc.getTrusteeAddress(String(trusteeId))
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  return {
    registeredAddress: data?.registeredAddress || null,
    correspondenceAddress: data?.correspondenceAddress || null,
    addressDetailsLoading: isLoading,
    error,
    validating: isValidating,
    refreshAddressDetails: mutate,
  };
}


// export function useGetSignatories(userId, stepperId) {
//   const URL =
//     userId && stepperId
//       ? endpoints.trusteeKyc.getSection(stepperId, userId, '')
//       : null;

//   const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
//     keepPreviousData: true,
//   });

//   const refreshSignatories = () => {
//     mutate(); // <-- trigger re-fetch
//   };

//   return {
//     signatories: data?.data || [],   // <-- ALWAYS ARRAY
//     loading: isLoading,
//     error,
//     validating: isValidating,
//     empty: !isLoading && (!data?.data || data.data.length === 0),
//     refreshSignatories,
//   };
// }

export function useGetDocuments(trusteeId) {
  const URL =
    trusteeId ? endpoints.trusteeKyc.getDocuments(String(trusteeId))
      : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshDocuments = () => {
    mutate(); // <-- trigger re-fetch
  };

  return {
    documents: data?.documents || [],   // <-- ALWAYS ARRAY
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.documents || data.documents.length === 0),
    refreshDocuments,
  };
}

export function useGetBankDetails(trusteeId) {
  const URL =
    trusteeId ? endpoints.trusteeKyc.getBankDetails(String(trusteeId))
      : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshDocuments = () => {
    mutate(); // <-- trigger re-fetch
  };

  return {
    bankDetails: data?.bankDetails || [],   // <-- ALWAYS ARRAY
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.bankDetails || data.bankDetails.length === 0),
    refreshDocuments,
  };
}

// export function useGetSignatories(trusteeId) {
//   const URL =
//     trusteeId ? endpoints.trusteeKyc.getTrusteeSignatories(String(trusteeId))
//       : null;

//   const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
//     keepPreviousData: true,
//   });

//   const refreshSignatories = () => {
//     mutate(); // <-- trigger re-fetch
//   };

//   return {
//     signatories: data?.signatories || [],   // <-- ALWAYS ARRAY
//     loading: isLoading,
//     error,
//     validating: isValidating,
//     empty: !isLoading && (!data?.signatories || data.signatories.length === 0),
//     refreshSignatories,
//   };
// }


export function useGetSignatories(trusteeId, queryString) {
  const URL =
    trusteeId ?
      queryString ? endpoints.trusteeKyc.getTrusteeSignatoriesWithFilter(String(trusteeId), queryString)
        : endpoints.trusteeKyc.getTrusteeSignatories(String(trusteeId))
      : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshSignatories = () => {
    mutate(); // <-- trigger re-fetch
  };

  return {
    signatories: data?.signatories || [],   // <-- ALWAYS ARRAY
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.signatories || data.signatories.length === 0),
    refreshSignatories,
  };
}


