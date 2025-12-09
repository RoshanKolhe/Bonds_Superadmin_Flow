import useSWR from 'swr';
import { useEffect, useMemo } from 'react';
import { fetcher, endpoints } from 'src/utils/axios';


export function useGetDocuments(companyId) {
    const URL =
        companyId ? endpoints.CompanyKyc.getDocuments(String(companyId))
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

export function useGetBankDetails(companyId) {
    const URL =
        companyId ? endpoints.CompanyKyc.getBankDetails(String(companyId))
            : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });

    const refreshBankDetails = () => {
        mutate(); // <-- trigger re-fetch
    };

    return {
        bankDetails: data?.bankDetails || [],   // <-- ALWAYS ARRAY
        loading: isLoading,
        error,
        validating: isValidating,
        empty: !isLoading && (!data?.bankDetails || data.bankDetails.length === 0),
        refreshBankDetails,
    };
}

export function useGetSignatories(companyId) {
    const URL =
        companyId ? endpoints.CompanyKyc.getCompanySignatories(String(companyId))
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
