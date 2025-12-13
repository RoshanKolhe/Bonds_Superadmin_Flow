import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetCompanyProfiles() {
    const URL = endpoints.companyProfiles.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            companyProfiles: data?.data?.profiles || [],
            totalCount: data?.data?.count || [],
            companyProfilesLoading: isLoading,
            companyProfilesError: error,
            companyProfilesValidating: isValidating,
            companyProfilesEmpty: !isLoading && (!data?.data?.profiles?.length),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCompanyProfile(id) {
    const URL = id ? [endpoints.companyProfiles.details(id)] : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            companyProfile: data || [],
            companyProfileLoading: isLoading,
            companyProfileError: error,
            companyProfileValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useFilterCompanyProfiles(params) {
    let URL = null;

    if (params.filter && params.status !== undefined) {
        URL = endpoints.companyProfiles.filterStatusList(params.filter, params.status);
    }
    else if (params.filter) {
        URL = endpoints.companyProfiles.filterList(params.filter);
    }
    else if (params.status !== undefined) {
        URL = endpoints.companyProfiles.statusList(params.status);
    }

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });
   
    return useMemo(
        () => ({
            filteredCompanyProfiles: data?.data?.profiles || [],
            totalCount: data?.data?.count || 0,
            filterLoading: isLoading,
            filterError: error,
            filterValidating: isValidating,
            filterEmpty: !isLoading && (!data?.data?.profiles?.length),
        }),
        [data, error, isLoading, isValidating]
    );
}
