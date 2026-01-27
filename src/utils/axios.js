//
import axios from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/auth/me',
    login: '/auth/super-admin-login',
    register: '/register',
    forgotPassword: '/auth/forget-password/send-email-otp',
    newPassword: '/auth/forget-password/verify-email-otp',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  scheduler: {
    list: '/schedulers',
    filterList: (filter) => `/schedulers?filter=${filter}`,
    details: (id) => `/schedulers/${id}`,
  },
  bondApplications: {
    list: '/bond-applications',
    filterList: (filter) => `/bond-applications?filter=${filter}`,
    details: (applicationId) => `/bond-applications/${applicationId}`,
    dataByStatus: (applicationId, statusValue) => `/bond-applications/${applicationId}/data-by-status/${statusValue}`,
    byIntermediary: (intermediaryType, id) =>
      `/bond-applications/by-intermediaries/${intermediaryType}/${id}`,
  },
  companyInfo: {
    list: '/api/kyc/issuer_kyc/company-info/',
    filterList: (filter) => `/api/kyc/issuer_kyc/company-info/?filter=${filter}`,
    details: (id) => `/api/kyc/issuer_kyc/company-info/${id}`,
  },
  creditRatingAgencies: {
    list: '/credit-rating-agencies',
    details: (id) => `/credit-rating-agencies/${id}`
  },
  creditRatings: {
    list: '/credit-ratings',
  },
  designation: {
    list: '/designations',
    filterList: (filter) => `/designations?filter=${filter}`,
    details: (id) => `/designations/${id}`,
  },
  roles: {
    list: '/roles',
    filterList: (filter) => `/roles?filter=${filter}`,
    details: (id) => `/roles/${id}`,
  },
  documentType: {
    list: '/document-types',
    filterList: (filter) => `/document-types?filter=${filter}`,
    details: (id) => `/document-types/${id}`,
  },
  companyProfiles: {
    list: '/company-profiles',
    filterList: (filter) => `/company-profiles?filter=${filter}`,
    statusList: (status) => `/company-profiles?status=${status}`,
    filterStatusList: (filter, status) => `/company-profiles?filter=${filter}&status=${status}`,
    details: (id) => `/company-profiles/${id}`,
  },
  CompanyKyc: {
    getDocuments: (companyId) => `/company-profiles/${companyId}/documents`,
    getBankDetails: (companyId) => `/company-profiles/${companyId}/bank-details`,
    // getFilteredBankDetails: (companyId) => `/company-profiles/${companyId}/bank-details?filter=${filter}`,
    getCompanySignatories: (companyId) => `/company-profiles/${companyId}/authorize-signatory`,
    getCompanySignatoriesWithFilter: (companyId, queryString) => `/company-profiles/${companyId}/authorize-signatory?filter=${queryString}`,
    getCompanyAddress: (companyId) => `/company-profiles/${companyId}/address-details`
  },

  trusteeProfiles: {
    list: '/trustee-profiles',
    filterList: (filter) => `/trustee-profiles?filter=${filter}`,
    statusList: (status) => `/trustee-profiles?status=${status}`,
    filterStatusList: (filter, status) => `/trustee-profiles?filter=${filter}&status=${status}`,
    details: (id) => `/trustee-profiles/${id}`,
  },
  trusteeEntityType: {
    list: '/trustee-entity-types',
    filterList: (filter) => `/trustee-entity-types?filter=${filter}`,
    details: (id) => `/trustee-entity-types/${id}`,
  },
  trusteeKyc: {
    kycProgress: (userId, stepperId) =>
      `/trustee-profiles/kyc-progress/${userId}?step=${encodeURIComponent(stepperId)}`,
    getSection: (stepperId, userId, route = '') =>
      `/trustee-profiles/kyc-get-data/${stepperId}/${userId}?route=${encodeURIComponent(route)}`,
    getDocuments: (trusteeId) => `/trustee-profiles/${trusteeId}/documents`,
    getBankDetails: (trusteeId) => `/trustee-profiles/${trusteeId}/bank-details`,
    getTrusteeSignatories: (trusteeId) => `/trustee-profiles/${trusteeId}/authorize-signatory`,
    getTrusteeSignatoriesWithFilter: (trusteeId, queryString) => `/trustee-profiles/${trusteeId}/authorize-signatory?filter=${queryString}`,
    getTrusteeAddress: (trusteeId) => `/trustee-profiles/${trusteeId}/address-details`
  },
};

