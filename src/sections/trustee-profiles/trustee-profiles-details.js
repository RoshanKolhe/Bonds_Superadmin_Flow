import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Stack, Avatar, Divider, Button, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Card } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useRouter } from 'src/routes/hook';

import axiosInstance from 'src/utils/axios';
import FormProvider, { RHFCustomFileUploadBox, RHFTextField } from 'src/components/hook-form';
import Label from 'src/components/label';
import { MultiFilePreview } from 'src/components/upload';
import Iconify from 'src/components/iconify';
import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';

const STATUS_DISPLAY = {
  0: { label: 'Pending', color: 'warning' },
  1: { label: 'Under Review', color: 'info' },
  2: { label: 'Approved', color: 'success' },
  3: { label: 'Rejected', color: 'error' },
};



export default function TrusteeProfileDetails({ data }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fields = [
    { name: 'email', label: 'Email', value: data?.users?.email },
    { name: 'phone', label: 'Contact No', value: data?.users?.phone },
    { name: 'CIN', label: 'CIN', value: data?.CIN },
    { name: 'GSTIN', label: 'GSTIN', value: data?.GSTIN },
    { name: 'sebiRegistrationNumber', label: 'Sebi Registration Number', value: data?.sebiRegistrationNumber },
    { name: 'sebiValidityDate', label: 'Sebi Valid Date', value: data?.sebiValidityDate ? new Date(data?.sebiValidityDate).toLocaleDateString() : '—'  },
    { name: 'cityOfIncorporation', label: 'City Of Incorporation', value: data?.cityOfIncorporation },
    { name: 'stateOfIncorporation', label: 'State Of Incorporation', value: data?.stateOfIncorporation },
    { name: 'countryOfIncorporation', label: 'Country Of Incorporation', value: data?.countryOfIncorporation },
    { name: 'udyamRegistrationNumber', label: 'Udyam Registration Number', value: data?.udyamRegistrationNumber },
    {name:'panFile', label: 'Pan File', value: data?.trusteePanCards?.panCardDocument},
    { name: 'createdAt', label: 'Created At', value: data?.createdAt ? new Date(data?.createdAt).toLocaleDateString() : '—' },
  ];

  const defaultValues = Object.fromEntries(fields.map((f) => [f.name, f.value || '']));

  const methods = useForm({ defaultValues });

  const { reset } = methods;

  useEffect(() => {
    if (data) reset(defaultValues);
  }, [data]);

  const handleStatusUpdate = async (type, reason = null) => {
    try {
      setLoading(true);

      const payload = {
        applicationId: data?.kycApplicationsId,
        status: type,
        rejectReason: reason || null,
      };

      await axiosInstance.patch('/kyc/handle-kyc-application', payload);

      enqueueSnackbar(
        `Trustee KYC ${String(type) === '1' ? 'Approved' : 'Rejected'}`,
        {
          variant: String(type) === '1' ? 'success' : 'error',
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

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      enqueueSnackbar('Please enter a reason', { variant: 'warning' });
      return;
    }

    handleStatusUpdate(2, rejectReason);
    setRejectOpen(false);
    setRejectReason('');
  };


  const [openPreview, setOpenPreview] = useState(false);

  const panFile = data?.trusteePanCards?.panCardDocument?.fileUrl;
  const fileType = data?.trusteePanCards?.panCardDocument?.fileType;

  const handleViewFile = () => {
    if (!panFile) return;

    if (fileType?.includes("pdf")) {
      window.open(panFile, "_blank"); // open PDF in full tab
    } else {
      setOpenPreview(true); // open image modal
    }
  };



  const panComparisonData = [
    {
      parameter: "PAN Number",
      extracted: data?.trusteePanCards?.extractedPanNumber || "—",
      submitted: data?.trusteePanCards?.submittedPanNumber || "—",
    },
    {
      parameter: "Trustee Name",
      extracted: data?.trusteePanCards?.extractedTrusteeName || "—",
      submitted: data?.trusteePanCards?.submittedTrusteeName || "—",
    },
  ];


  return (
    <Card sx={{ p: 4 }}>
      <FormProvider methods={methods}>
        {/* -------- Header Section -------- */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* Avatar + Name */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              alt={data?.legalEntityName}
            />

            <Stack spacing={0.8}>
              <Typography variant="h5" fontWeight={600}>
                {data?.legalEntityName}
              </Typography>
            </Stack>
          </Stack>

          {/* Status */}
          <Label
            color={STATUS_DISPLAY[data?.kycApplications?.status]?.color || 'default'}
            sx={{ px: 2, py: 1, borderRadius: 1 }}
          >
            {STATUS_DISPLAY[data?.kycApplications?.status]?.label || 'Unknown'}
          </Label>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* -------- Read-Only Form Fields -------- */}
        <Grid container spacing={2}>
           {fields
            .filter((field) => field.name !== 'panFile')
            .map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              <RHFTextField name={field.name} label={field.label} disabled />
            </Grid>
          ))}
        </Grid>
        <Grid item mt={2} xs={12}>
          <RHFCustomFileUploadBox 
          name="panFile"
          label= "Upload pan"
          disabled
          />
          {/* <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 2,
              mt: 3,
              mb: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              PAN Card Details
            </Typography>

            {data?.trusteePanCards?.panCardDocument?.fileUrl ? (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  const url = data?.trusteePanCards?.panCardDocument?.fileUrl;
                  if (url) {
                    window.open(url, '_blank');
                  } else {
                    enqueueSnackbar('PAN preview file not found!', { variant: 'error' });
                  }
                }}
                sx={{
                  height: 32,
                  px: 1.5,
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                }}
                startIcon={<Iconify icon="mdi:eye" />}
              >
                Preview PAN Card
              </Button>
            ) : (
              <Typography color="text.secondary">No PAN file uploaded.</Typography>
            )}
          </Box> */}
        </Grid>


        <TableContainer
          component={Paper}
          sx={{
            mt: 3,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
            border: "1px solid #BDBDBD",
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <Table

            sx={{ minWidth: 600 }}

          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#2F2F2F", color: "#fff", fontWeight: 600 }}>
                  Parameter
                </TableCell>
                <TableCell sx={{ backgroundColor: "info.darker", color: "#fff", fontWeight: 700 }}>
                  Extracted
                </TableCell>
                <TableCell sx={{ backgroundColor: "#00A786", color: "#fff", fontWeight: 600 }}>
                  Submitted
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {panComparisonData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: 500 }}>{row.parameter}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{row.extracted}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{row.submitted}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {openPreview && (
          <Box
            onClick={() => setOpenPreview(false)}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
              cursor: "zoom-out",
            }}
          >
            <img
              src={panFile}
              alt="Preview"
              style={{
                maxWidth: "80%",
                maxHeight: "80%",
                borderRadius: 10,
                boxShadow: "0px 4px 10px rgba(0,0,0,0.4)",
              }}
            />
          </Box>
        )}




        {/* -------- Action Buttons -------- */}
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button variant="soft" onClick={() => router.back()} disabled={loading}>
            Close
          </Button>

          <Button
            variant="soft"
            color="error"
            onClick={() => setRejectOpen(true)}
            disabled={loading || data?.kycApplications?.status === 2}
          >
            Decline
          </Button>

          <Button
            variant="soft"
            color="success"
            onClick={() => handleStatusUpdate(1)}
            disabled={loading || data?.kycApplications?.status === 2}
          >
            Approve
          </Button>
        </Stack>
      </FormProvider>
      <RejectReasonDialog
        title={'Decline Profile'}
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        reason={rejectReason}
        setReason={setRejectReason}
        onSubmit={handleRejectSubmit}
      />
    </Card>
  );
}

TrusteeProfileDetails.propTypes = {
  data: PropTypes.object,
};
