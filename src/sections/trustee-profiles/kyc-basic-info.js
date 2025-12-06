import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { useSnackbar } from 'src/components/snackbar';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Card, Divider } from '@mui/material';
// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFSelect, RHFAutocomplete } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import dayjs from 'dayjs';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { useGetKycProgress } from 'src/api/trusteeKyc';
import { useGetTrusteeEntityTypes } from 'src/api/entityType';
import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';

// ----------------------------------------------------------------------

const STATUS_DISPLAY = {
  0: { label: 'Pending', color: 'warning' },
  1: { label: 'Under Review', color: 'info' },
  2: { label: 'Approved', color: 'success' },
  3: { label: 'Rejected', color: 'error' },
};


export default function KYCBasicInfo({ trusteeProfile }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [panExtractionStatus, setPanExtractionStatus] = useState('idle'); // 'idle' | 'success' | 'failed'
  const [extractedPanDetails, setExtractedPanDetails] = useState(null);
  const [uploadedPanFile, setUploadedPanFile] = useState(null);
  const isPanUploaded = Boolean(uploadedPanFile);
  // State to store mapped API values
  const [sectorOptions, setSectorOptions] = useState([]);
  const [entityOptions, setEntityOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const { EntityTypes, EntityTypesEmpty } = useGetTrusteeEntityTypes();

  const [humanInteraction, setHumanInteraction] = useState({
    companyName: false,
    gstin: false,
    dateOfIncorporation: false,
    msmeUdyamRegistrationNo: false,
    city: false,
    state: false,
    country: false,
    panNumber: false,
    dateOfBirth: false,
    panHoldersName: false,
    sebiRegistrationNumber: false,
    sebiValidityDate: false,
  });

  const handleHumanInteraction = (fieldName) => {
    if (!humanInteraction[fieldName]) {
      setHumanInteraction((prev) => ({
        ...prev,
        [fieldName]: true,
      }));
    }
  };

  const NewUserSchema = Yup.object().shape({
    cin: Yup.string().required('CIN is required'),
    companyName: Yup.string().required('Company Name is required'),
    gstin: Yup.string().required('GSTIN is required'),
    dateOfIncorporation: Yup.date().required('Date of Incorporation is required'),
    msmeUdyamRegistrationNo: Yup.string().required('MSME Udyam Registration No is required'),
    sebiRegistrationNumber: Yup.string().required('SEBI Registration Number is required'),
    sebiValidityDate: Yup.date().required('SEBI Validity Date is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    panFile: Yup.mixed().required('PAN file is required'),
    panNumber: Yup.string().required('PAN Number is required'),
    dateOfBirth: Yup.date().required('Date Of Birth is required'),
    panHoldersName: Yup.string().required("PAN Holder's Name is required"),
    companyEntityTypeId: Yup.string().required('Entity Type is required'),
  });

  const defaultValues = useMemo(
    () => ({
      cin: '',
      companyName: '',
      gstin: '',
      dateOfIncorporation: null,
      msmeUdyamRegistrationNo: '',
      sebiRegistrationNumber: '',
      sebiValidityDate: null,
      city: '',
      state: '',
      country: 'India',
      panFile: null,
      panNumber: '',
      dateOfBirth: null,
      panHoldersName: '',
      panCardDocumentId: '',
      companyEntityTypeId: '',
      humanInteraction: { ...humanInteraction },
    }),
    [humanInteraction]
  );


  // Status Update Patch cll for approved the trustee
  const handleStatusUpdate = async (type, reason = null) => {
    try {
      setLoading(true);

      const payload = {
        applicationId: trusteeProfile?.kycApplicationsId,
        status: type,
        rejectReason: reason || null,
      };

      await axiosInstance.patch('/auth/handle-kyc-application', payload);

      enqueueSnackbar(
        `Trustee KYC ${String(type) === '2' ? 'Approved' : 'Rejected'}`,
        {
          variant: String(type) === '2' ? 'success' : 'error',
        }
      );

      setTimeout(() => router.back(), 800);

    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'Something went wrong', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Reject Box
  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      enqueueSnackbar('Please enter a reason', { variant: 'warning' });
      return;
    }

    handleStatusUpdate(3, rejectReason);
    setRejectOpen(false);
    setRejectReason('');
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const handlePanUpload = async (file) => {
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const uploadRes = await axiosInstance.post('/files', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploaded = uploadRes?.data?.files?.[0];
      if (!uploaded || !uploaded.id) {
        throw new Error('PAN file upload failed');
      }

      setUploadedPanFile(uploaded);
      setValue('panCardDocumentId', uploaded.id, { shouldValidate: true });

      const extractRes = await axiosInstance.post('/extract/pan-info', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const panData = extractRes?.data?.data || extractRes?.data;

      // Adjust these keys according to your actual API response
      const panNumberFromApi = panData?.extractedPanNumber || '';
      const dobFromApi = panData?.extractedDateOfBirth || '';
      const panHolderNameFromApi = panData?.extractedPanHolderName || '';

      if (!panNumberFromApi && !dobFromApi && !panHolderNameFromApi) {
        // Treat as failure if nothing useful came back
        setPanExtractionStatus('failed');
        enqueueSnackbar(
          "We couldn't fetch details from your PAN document. Please fill the details manually.",
          { variant: 'error' }
        );
        return;
      }

      // Fill form values from extraction
      if (panHolderNameFromApi) {
        setValue('companyName', panHolderNameFromApi, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      if (panNumberFromApi) {
        setValue('panNumber', panNumberFromApi, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      if (dobFromApi) {
        setValue('dateOfBirth', dayjs(dobFromApi).toDate(), {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      // Save extracted details in state for final payload
      const extracted = {
        extractedTrusteeName: panHolderNameFromApi || '',
        extractedPanNumber: panNumberFromApi || '',
        extractedDateOfBirth: dobFromApi || '',
      };

      setExtractedPanDetails(extracted);
      setPanExtractionStatus('success');

      enqueueSnackbar('PAN details extracted successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error in PAN upload/extraction:', error);
      setPanExtractionStatus('failed');
      enqueueSnackbar(
        "We couldn't fetch details from your PAN document. Please fill the details manually.",
        { variant: 'error' }
      );
    }
  };

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const sessionId = localStorage.getItem('sessionId') || '';

      const dateOfIncorporationStr = formData.dateOfIncorporation
        ? dayjs(formData.dateOfIncorporation).format('YYYY-MM-DD')
        : '';

      const dobStr = formData.dateOfBirth ? dayjs(formData.dateOfBirth).format('YYYY-MM-DD') : '';

      // Detect if user changed PAN fields manually
      let humanEdited = false;

      if (extractedPanDetails) {
        humanEdited =
          extractedPanDetails.extractedTrusteeName !== formData.panHoldersName ||
          extractedPanDetails.extractedPanNumber !== formData.panNumber ||
          extractedPanDetails.extractedDateOfBirth !== dobStr;
      }

      // Build extracted PAN object
      const extractedPan = extractedPanDetails
        ? {
          extractedTrusteeName: extractedPanDetails.extractedCompanyName || '',
          extractedPanNumber: extractedPanDetails.extractedPanNumber || '',
          extractedDateOfBirth: extractedPanDetails.extractedDateOfBirth || '',
        }
        : {
          extractedTrusteeName: formData.panHoldersName,
          extractedPanNumber: formData.panNumber,
          extractedDateOfBirth: dobStr,
        };

      // Build submitted PAN object
      const submittedPan = humanEdited
        ? {
          submittedTrusteeName: formData.panHoldersName,
          submittedPanNumber: formData.panNumber,
          submittedDateOfBirth: dobStr,
        }
        : {};

      // FINAL API PAYLOAD — 100% MATCHES THE API FORMAT YOU GAVE
      const payload = {
        sessionId,
        legalEntityName: formData.companyName,
        CIN: formData.cin,
        GSTIN: formData.gstin,
        udyamRegistrationNumber: formData.msmeUdyamRegistrationNo,

        dateOfIncorporation: dateOfIncorporationStr,
        sebiRegistrationNumber: formData.sebiRegistrationNumber,
        sebiValidityDate: formData.sebiValidityDate
          ? dayjs(formData.sebiValidityDate).format('YYYY-MM-DD')
          : '',

        cityOfIncorporation: formData.city,
        stateOfIncorporation: formData.state,
        countryOfIncorporation: formData.country,

        humanInteraction: humanEdited ? true : false,

        extractedPanDetails: extractedPan,
        submittedPanDetails: submittedPan,

        panCardDocumentId: formData.panCardDocumentId,
        trusteeEntityTypesId: formData.companyEntityTypeId,
      };

      console.log('FINAL Trustee Registration Payload:', payload);

      const response = await axiosInstance.post('/auth/trustee-registration', payload);

      if (response?.data?.success) {
        const usersId = response?.data?.usersId;

        // ✅ Store it so next page can access it
        if (usersId) {
          sessionStorage.setItem('trustee_user_id', usersId);
        } else {
          console.warn('No usersId found in trustee-registration response');
        }
        enqueueSnackbar(response.data.message || 'Trustee Registration Successful', {
          variant: 'success',
        });

        reset();
        router.push(paths.kycCompanyDetails);
      } else {
        throw new Error(response?.data?.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.response?.data?.message || error.message || 'Something went wrong', {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (!trusteeProfile) return;

    console.log('Setting defaults from trusteeProfile:', trusteeProfile);

    const pan = trusteeProfile?.trusteePanCards;
    const panDoc = pan?.panCardDocument;

    reset({
      cin: trusteeProfile?.CIN || '',
      companyName: trusteeProfile?.legalEntityName || '',
      gstin: trusteeProfile?.GSTIN || '',
      dateOfIncorporation: trusteeProfile?.dateOfIncorporation
        ? dayjs(trusteeProfile.dateOfIncorporation).toDate()
        : null,

      msmeUdyamRegistrationNo: trusteeProfile?.udyamRegistrationNumber || '',
      sebiRegistrationNumber: trusteeProfile?.sebiRegistrationNumber || '',
      sebiValidityDate: trusteeProfile?.sebiValidityDate
        ? dayjs(trusteeProfile.sebiValidityDate).toDate()
        : null,

      city: trusteeProfile?.cityOfIncorporation || '',
      state: trusteeProfile?.stateOfIncorporation || '',
      country: trusteeProfile?.countryOfIncorporation || 'India',

      // PAN values
      panNumber: pan?.submittedPanNumber || pan?.extractedPanNumber || '',
      dateOfBirth: pan?.submittedDateOfBirth
        ? dayjs(pan.submittedDateOfBirth).toDate()
        : pan?.extractedDateOfBirth
          ? dayjs(pan.extractedDateOfBirth).toDate()
          : null,
      panHoldersName: pan?.submittedTrusteeName || pan?.extractedTrusteeName || '',

      // entity type
      companyEntityTypeId: trusteeProfile?.trusteeEntityTypesId || '',

      panCardDocumentId: pan?.panCardDocumentId || '',
    });

    // PAN Preview
    if (panDoc?.fileUrl) {
      setUploadedPanFile({
        name: panDoc.fileOriginalName,
        url: panDoc.fileUrl,
        id: panDoc.id,
        isServerFile: true,
      });
    }
  }, [trusteeProfile, reset]);

  useEffect(() => {
    if (EntityTypes && !EntityTypesEmpty) {
      setEntityOptions(EntityTypes);
    } else {
      setEntityOptions([]);
    }
  }, [EntityTypes, EntityTypesEmpty]);

  return (
    <Container>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card
          sx={{
            p: { xs: 2, sm: 3, md: 4 }, // responsive padding
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Grid container spacing={3} sx={{ py: 4 }}>
            <Grid xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="solar:card-bold" width={24} />
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    CIN*
                  </Box>
                </Box>
                <RHFTextField
                  name="cin"
                  placeholder="Enter your CIN"
                  disabled
                // InputProps={{
                //   endAdornment: (
                //     <Button
                //       variant="contained"
                //       size="small"
                //       sx={{
                //         bgcolor: '#00328A',
                //         color: 'white',
                //         textTransform: 'none',
                //         fontWeight: 600,
                //         borderRadius: '6px',
                //         ml: 1,
                //         minHeight: '32px',
                //         lineHeight: 1,
                //         px: 2,
                //         '&:hover': { bgcolor: '#00328A' },
                //       }}
                //       onClick={async () => {
                //         const cinValue = getValues('cin');

                //         if (!cinValue) {
                //           enqueueSnackbar('Please enter a CIN before fetching.', {
                //             variant: 'warning',
                //           });
                //           return;
                //         }

                //         try {
                //           const response = await axiosInstance.post('/extraction/company-info', {
                //             CIN: cinValue,
                //           });

                //           const data = response?.data?.data;

                //           if (response.data.success && data) {
                //             // ⭐ Correct mapping based on your API response

                //             setValue('companyName', data.companyName || '', {
                //               shouldValidate: true,
                //               shouldDirty: true,
                //             });

                //             setValue('gstin', data.gstin || '', {
                //               shouldValidate: true,
                //               shouldDirty: true,
                //             });

                //             setValue(
                //               'dateOfIncorporation',
                //               data.dateOfIncorporation
                //                 ? new Date(data.dateOfIncorporation)
                //                 : null,
                //               { shouldValidate: true, shouldDirty: true }
                //             );

                //             setValue('city', data.cityOfIncorporation || '', {
                //               shouldValidate: true,
                //               shouldDirty: true,
                //             });

                //             setValue('state', data.stateOfIncorporation || '', {
                //               shouldValidate: true,
                //               shouldDirty: true,
                //             });

                //             setValue('country', data.countryOfIncorporation || 'India', {
                //               shouldValidate: true,
                //               shouldDirty: true,
                //             });

                //             setValue('panNumber', data.companyPanNumber || '', {
                //               shouldValidate: true,
                //               shouldDirty: true,
                //             });

                //             enqueueSnackbar('CIN details extracted successfully', {
                //               variant: 'success',
                //             });
                //           } else {
                //             throw new Error(
                //               response.data.message || 'Failed to extract CIN details'
                //             );
                //           }
                //         } catch (error) {
                //           console.error('Error extracting CIN:', error);
                //           enqueueSnackbar(
                //             error?.response?.data?.message ||
                //               'Failed to fetch CIN data. Please check CIN and try again.',
                //             { variant: 'error' }
                //           );
                //         }
                //       }}
                //       disabled
                //     >
                //       Fetch
                //     </Button>
                //   ),
                // }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="solar:buildings-bold" width={24} />
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    Legal Entity Name* (As per Adhar)
                  </Box>
                </Box>
                <RHFTextField
                  name="companyName"
                  placeholder="Enter your Company Name"
                  onFocus={() => handleHumanInteraction('companyName')}
                  disabled
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="material-symbols:percent" width={24} />
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    GSTIN*
                  </Box>
                </Box>
                <RHFTextField
                  name="gstin"
                  placeholder="Enter your GSTIN"
                  onFocus={() => handleHumanInteraction('gstin')}
                  disabled
                />
              </Box>
            </Grid>
            <Grid xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <Box
                sx={{
                  height: { xs: 'auto', md: 'calc(3.82 * (56px + 24px))' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: { xs: 0, md: 3 },
                }}
              >
                <Box
                  component="img"
                  src="/assets/images/kyc/kyc-basic-info/kyc-img.svg"
                  alt="KYC Illustration"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="solar:shield-bold" width={24} />
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    SEBI Registration Number*
                  </Box>
                </Box>
                <RHFTextField
                  name="sebiRegistrationNumber"
                  placeholder="Enter your Registration Number"
                  disabled
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="solar:calendar-bold" width={24} />
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    Date of Incorporation*
                  </Box>
                </Box>
                <Controller
                  name="dateOfIncorporation"
                  control={control}
                  disabled
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      value={field.value}
                      disabled
                      onChange={(newValue) => {
                        field.onChange(newValue);
                        handleHumanInteraction('dateOfIncorporation');
                      }}
                      onOpen={() => handleHumanInteraction('dateOfIncorporation')}
                      format="dd-MM-yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="solar:buildings-2-bold" width={24} />
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    MSME/Udyam Registration No.*
                  </Box>
                </Box>
                <RHFTextField
                  name="msmeUdyamRegistrationNo"
                  placeholder="Enter your MSME/Udyam Registration No."
                  disabled
                />
              </Box>
            </Grid>
            <Grid xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:calendar-bold" width={24} />
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      SEBI Validity Date*
                    </Box>
                  </Box>
                  <Controller
                    name="sebiValidityDate"
                    control={control}
                    disabled
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        value={field.value}
                        disabled
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          handleHumanInteraction('sebiValidityDate');
                        }}
                        onOpen={() => handleHumanInteraction('sebiValidityDate')}
                        format="dd-MM-yyyy"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Box>
                <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="solar:map-point-bold" width={24} />
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    Place of Incorporation*
                  </Box>
                </Box>
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                  <RHFTextField
                    name="city"
                    placeholder="City"
                    sx={{ flex: 1 }}
                    onFocus={() => handleHumanInteraction('city')}
                    disabled
                  />
                  <RHFSelect
                    name="state"
                    sx={{ flex: 1 }}
                    onFocus={() => handleHumanInteraction('state')}
                    SelectProps={{
                      displayEmpty: true,
                      onOpen: () => handleHumanInteraction('state'),
                      renderValue: (selected) =>
                        selected ? selected : <Box sx={{ color: 'text.disabled' }}>State</Box>,
                    }}
                    disabled
                  >
                    <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                  </RHFSelect>
                  <RHFAutocomplete
                    name="country"
                    placeholder="Country"
                    disabled
                    sx={{ flex: 1 }}
                    readOnly
                    onOpen={() => handleHumanInteraction('country')}
                    options={countries.map((country) => country.label)}
                    getOptionLabel={(option) => option}
                    renderOption={(props, option) => {
                      const { code, label, phone } = countries.find(
                        (country) => country.label === option
                      );
                      return (
                        <li {...props} key={label}>
                          <Iconify
                            key={label}
                            icon={`circle-flags:${code.toLowerCase()}`}
                            width={28}
                            sx={{ mr: 1 }}
                          />
                          {label} ({code}) +{phone}
                        </li>
                      );
                    }}
                  />
                </Stack>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:buildings-2-bold" width={24} />
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      Entity Type*
                    </Box>
                  </Box>
                  <RHFSelect name="companyEntityTypeId" disabled>
                    <MenuItem value="">Select Entity Type</MenuItem>
                    {entityOptions.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid xs={12} md={12}>
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                {/* Icon + Label */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="solar:document-upload-bold" width={24} />
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    Uploaded PAN Details :
                  </Box>
                </Box>

                {/* Preview Button */}
                {trusteeProfile?.trusteePanCards?.panCardDocument?.fileUrl ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      const url = trusteeProfile?.trusteePanCards?.panCardDocument?.fileUrl;
                      if (url) {
                        window.open(url, '_blank');
                      } else {
                        enqueueSnackbar('PAN preview file not found!', { variant: 'error' });
                      }
                    }}
                    sx={{
                      height: 36,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                    startIcon={<Iconify icon="mdi:eye" />}
                  >
                    Preview PAN Card
                  </Button>
                ) : (
                  <Typography color="text.secondary">No PAN file uploaded.</Typography>
                )}
              </Box>

              <YupErrorMessage name="panFile" />
            </Box>
          </Grid>

          <Grid container spacing={3}>
            {/* PAN Number (Left) */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon="solar:card-bold" width={24} />
                <Box component="span" sx={{ fontWeight: 600 }}>
                  PAN Number*
                </Box>
              </Box>
              <RHFTextField
                name="panNumber"
                placeholder="Your PAN Number"
                disabled
                onFocus={() => handleHumanInteraction('panNumber')}
              />
            </Grid>

            {/* Date of Birth (Right) */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon="solar:calendar-bold" width={24} />
                <Box component="span" sx={{ fontWeight: 600 }}>
                  Date of Birth*
                </Box>
              </Box>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    value={field.value}
                    disabled
                    onChange={(newValue) => {
                      field.onChange(newValue);
                      handleHumanInteraction('dateOfBirth');
                    }}
                    onOpen={() => handleHumanInteraction('dateOfBirth')}
                    format="dd-MM-yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: 'DD-MM-YYYY',
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* PAN Holder’s Name (Full width below) */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon="solar:user-bold" width={24} />
                <Box component="span" sx={{ fontWeight: 600 }}>
                  PAN Holder's Name*
                </Box>
              </Box>
              <RHFTextField
                name="panHoldersName"
                placeholder="Enter Name as per PAN"
                disabled
                onFocus={() => handleHumanInteraction('panHoldersName')}
              />
            </Grid>
          </Grid>



          {/* -------- Action Buttons -------- */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button variant="outlined" onClick={() => router.back()} disabled={loading}>
              Close
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={() => setRejectOpen(true)}
              disabled={loading || trusteeProfile?.kycApplications?.status === 2}
            >
              Reject
            </Button>

            <Button
              variant="contained"
              color="success"
              onClick={() => handleStatusUpdate(2)}
              disabled={loading || trusteeProfile?.kycApplications?.status === 2}
            >
              Approve
            </Button>
          </Stack>
        </Card>
      </FormProvider>
      <RejectReasonDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        reason={rejectReason}
        setReason={setRejectReason}
        onSubmit={handleRejectSubmit}
      />
    </Container>
  );
}
