import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Stack, Avatar, Divider, Button, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useRouter } from 'src/routes/hook';

import axiosInstance from 'src/utils/axios';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Label from 'src/components/label';
import { MultiFilePreview } from 'src/components/upload';
import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';

const STATUS_DISPLAY = {
  0: { label: 'Pending', color: 'warning' },
  1: { label: 'Under Review', color: 'info' },
  2: { label: 'Approved', color: 'success' },
  3: { label: 'Rejected', color: 'error' },
};



export default function CompanyProfileDetails({ data }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');


  const fields = [
    { name: 'email', label: 'Email', value: data?.data?.users?.email },
    { name: 'phone', label: 'Contact No', value: data?.data?.users?.phone },
    { name: 'CIN', label: 'CIN', value: data?.data?.CIN },
    { name: 'GSTIN', label: 'GSTIN', value: data?.data?.GSTIN },
    { name: 'dateOfIncorporation', label: 'Date Of Incorporation', value: data?.data?.dateOfIncorporation },
    { name: 'cityOfIncorporation', label: 'City Of Incorporation', value: data?.data?.cityOfIncorporation },
    { name: 'stateOfIncorporation', label: 'State Of Incorporation', value: data?.data?.stateOfIncorporation },
    { name: 'countryOfIncorporation', label: 'Country Of Incorporation', value: data?.data?.countryOfIncorporation },
    { name: 'udyamRegistrationNumber', label: 'Udyam Registration Number', value: data?.data?.udyamRegistrationNumber },
    { name: 'createdAt', label: 'Created At', value: data?.data?.createdAt ? new Date(data?.data?.createdAt).toLocaleDateString() : '—' },
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
        applicationId: data?.data?.kycApplicationsId,
        status: type,
        rejectReason: reason || null,   
      };

      await axiosInstance.patch('/auth/handle-kyc-application', payload);

      enqueueSnackbar(
        `Company KYC ${String(type) === '2' ? 'Approved' : 'Rejected'}`,
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
  


  const [openPreview, setOpenPreview] = useState(false);

  const panFile = data?.data?.companyPanCards?.panCardDocument?.fileUrl;
  const fileType = data?.data?.companyPanCards?.panCardDocument?.fileType;

  const handleViewFile = () => {
    if (!panFile) return;

    if (fileType?.includes("pdf")) {
      window.open(panFile, "_blank"); // open PDF in full tab
    } else {
      setOpenPreview(true); // open image modal
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      enqueueSnackbar('Please enter a reason', { variant: 'warning' });
      return;
    }

    handleStatusUpdate(3, rejectReason);
    setRejectOpen(false);
    setRejectReason('');
  };




  const panComparisonData = [
    {
      parameter: "PAN Number",
      extracted: data?.data?.companyPanCards?.extractedPanNumber || "—",
      submitted: data?.data?.companyPanCards?.submittedPanNumber || "—",
    },
    {
      parameter: "Company Name",
      extracted: data?.data?.companyPanCards?.extractedCompanyName || "—",
      submitted: data?.data?.companyPanCards?.submittedCompanyName || "—",
    },
    {
      parameter: "Date of Birth / Incorporation",
      extracted: data?.data?.companyPanCards?.extractedDateOfBirth ? new Date(data?.data?.companyPanCards?.extractedDateOfBirth).toLocaleDateString() : "—",
      submitted: data?.data?.companyPanCards?.submittedDateOfBirth ? new Date(data?.data?.companyPanCards?.submittedDateOfBirth).toLocaleDateString() : "—",
    },
  ];


  return (
    <Box>
      <FormProvider methods={methods}>
        {/* -------- Header Section -------- */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* Avatar + Name */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: '#FFC107',
                color: '#000',
                fontSize: 30,
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              {data?.data?.companyName?.charAt(0) || '?'}
            </Avatar>

            <Stack spacing={0.8}>
              <Typography variant="h5" fontWeight={600}>
                {data?.data?.companyName}
              </Typography>
            </Stack>
          </Stack>

          {/* Status */}
          <Label
            color={STATUS_DISPLAY[data?.data?.kycApplications?.status]?.color || 'default'}
            sx={{ px: 2, py: 1, borderRadius: 1 }}
          >
            {STATUS_DISPLAY[data?.data?.kycApplications?.status]?.label || 'Unknown'}
          </Label>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* -------- Read-Only Form Fields -------- */}
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              <RHFTextField name={field.name} label={field.label} disabled />
            </Grid>
          ))}
        </Grid>


        <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          PAN Card Details
        </Typography>


        {panFile && (
          <Button
            variant="outlined"
            sx={{ mb: 2 }}
            onClick={handleViewFile}
          >
            View File
          </Button>
        )}



        <TableContainer
          component={Paper}
          sx={{
            mt: 3,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
            border: "1px solid #BDBDBD",
          }}
        >
          <Table>
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



        <Divider sx={{ my: 3 }} />

        {/* -------- Action Buttons -------- */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => router.back()} disabled={loading}>
            Close
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={() => setRejectOpen(true)}
            disabled={loading || data?.data?.kycApplications?.status === 2}
          >
            Reject
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={() => handleStatusUpdate(2)}
            disabled={loading || data?.data?.kycApplications?.status === 2}
          >
            Approve
          </Button>
        </Stack>
      </FormProvider>
      <RejectReasonDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        reason={rejectReason}
        setReason={setRejectReason}
        onSubmit={handleRejectSubmit}
      />

    </Box>
  );
}

CompanyProfileDetails.propTypes = {
  data: PropTypes.object,
};
