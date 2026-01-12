// import * as Yup from 'yup';
// import { Grid, Stack } from "@mui/material";
// import FormProvider, { RHFCustomFileUploadBox, RHFTextField } from "src/components/hook-form";
// import { useEffect, useMemo } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useGetBondApplicationStepData } from 'src/api/bondApplications';
// import { useParams } from 'src/routes/hook';
// import YupErrorMessage from 'src/components/error-field/yup-error-messages';

// export default function ValuatorApprovalCard() {
//     const params = useParams();
//     const { applicationId } = params;
//     const { stepData, stepDataLoading } = useGetBondApplicationStepData(applicationId, '');

//     const valuatorApprovalSchema = Yup.object().shape({
//         securityDocRef: Yup.string().required('Security document ref is required'),
//         securityDocument: Yup.mixed().required('Security document is required'),
//         assetCoverCertificate: Yup.mixed().required('Asset cover certificate is required'),
//         valuationReport: Yup.mixed().required('Valuation report is required'),
//         remark: Yup.string()
//     });

//     const defaultValues = useMemo(() => ({
//         securityDocRef: '',
//         securityDocument: null,
//         assetCoverCertificate: null,
//         valuationReport: null
//     }), []);

//     const methods = useForm({
//         resolver: yupResolver(valuatorApprovalSchema),
//         defaultValues
//     });

//     const {
//         handleSubmit,
//         formState: { isSubmitting },
//         reset
//     } = methods;

//     const onSubmit = handleSubmit((formData) => {
//         // 
//     });

//     useEffect(() => {
//         // if(){
//         // reset(defaultValues); 
//         // }
//     }, [reset, defaultValues]);

//     return (
//         <FormProvider>
//             <Grid container spacing={1}>
//                 <Grid item xs={12} md={4}>
//                     <RHFTextField name='securityDocRef' label="Security Document Ref" fullWidth />
//                 </Grid>
//                 <Grid item xs={12} md={12}>
//                     <Stack spacing={2}>
//                         <RHFCustomFileUploadBox
//                             name='securityDocument'
//                             label="Security Document"
//                             accept={{
//                                 'application/pdf': ['.pdf'],
//                                 'image/png': ['.png'],
//                                 'image/jpeg': ['.jpg', '.jpeg'],
//                             }}
//                         />
//                         <YupErrorMessage name='securityDocument' />


//                         <RHFCustomFileUploadBox
//                             name='assetCoverCertificate'
//                             label="Asset Cover Certificate"
//                             accept={{
//                                 'application/pdf': ['.pdf'],
//                                 'image/png': ['.png'],
//                                 'image/jpeg': ['.jpg', '.jpeg'],
//                             }}
//                         />
//                         <YupErrorMessage name='assetCoverCertificate' />

//                         <RHFCustomFileUploadBox
//                             name='valuationReport'
//                             label="Valuation Report"
//                             accept={{
//                                 'application/pdf': ['.pdf'],
//                                 'image/png': ['.png'],
//                                 'image/jpeg': ['.jpg', '.jpeg'],
//                             }}
//                         />
//                         <YupErrorMessage name='valuationReport' />
//                     </Stack>
//                 </Grid>
//                 <Grid item xs={12} md={12}>
//                     <RHFTextField
//                         name='remark'
//                         label="Remark"
//                         multiline
//                         rows={3}
//                         fullWidth
//                     />
//                 </Grid>
//             </Grid>
//         </FormProvider>
//     )
// }


import * as Yup from 'yup';
import {
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import FormProvider, {
  RHFCustomFileUploadBox,
  RHFTextField,
} from 'src/components/hook-form';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetBondApplicationStepData } from 'src/api/bondApplications';
import { useParams } from 'src/routes/hook';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'src/components/snackbar';
import axiosInstance from 'src/utils/axios';

export default function ValuatorApprovalCard({ open, onClose, applicationId }) {

  const { enqueueSnackbar } = useSnackbar();

  const [isSubmittingApi, setIsSubmittingApi] = useState(false);

  const valuatorApprovalSchema = Yup.object().shape({
    // securityDocRef: Yup.string().required('Security document ref is required'),
    // securityDocument: Yup.mixed().required('Security document is required'),
    assetCoverCertificate: Yup.mixed().required('Asset cover certificate is required'),
    valuationReport: Yup.mixed().required('Valuation report is required'),
    remark: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      // securityDocRef: '',
      // securityDocument: null,
      assetCoverCertificate: null,
      valuationReport: null,
      remark: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(valuatorApprovalSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  const values = watch();



  const submitData = async () => {
    try {
      setIsSubmittingApi(true);

      //   if (status === 'REJECTED' && !values.remark) {
      //     enqueueSnackbar('Remark is mandatory for rejection', { variant: 'error' });
      //     return;
      //   }

      const payload = {
        // securityDocRef: values.securityDocRef,
        // securityDocument: values.securityDocument?.id,
        assetCoverCertificateId: values.assetCoverCertificate?.id,
        valuationReportId: values.valuationReport?.id,
        remark: values.remark || '',

      };

      console.log('Valuator Approval Payload:', payload);


      await axiosInstance.post(`/bonds-pre-issue/approval/valuator-approval/${applicationId}`, payload);

      enqueueSnackbar(`Valuation approved successfully`, {
        variant: 'success',
      });

      onClose();
      reset(defaultValues);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    } finally {
      setIsSubmittingApi(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ fontWeight: 600, pb: 3 }} >
        Valuator Approval
      </DialogTitle>

      <DialogContent dividers>
        <FormProvider methods={methods}  >
          <Grid container spacing={2} sx={{ pt: 2 }}>
            {/* <Grid item xs={12} md={4}>
              <RHFTextField name="securityDocRef" label="Security Document Ref" fullWidth />
            </Grid> */}

            <Grid item xs={12}>
              <Stack spacing={2}>
                {/* <RHFCustomFileUploadBox
                  name="securityDocument"
                  label="Security Document"
                  accept={{
                    'application/pdf': ['.pdf'],
                    'image/png': ['.png'],
                    'image/jpeg': ['.jpg', '.jpeg'],
                  }}
                />
                <YupErrorMessage name="securityDocument" /> */}

                <RHFCustomFileUploadBox
                  name="assetCoverCertificate"
                  label="Asset Cover Certificate"
                  accept={{
                    'application/pdf': ['.pdf'],
                    'image/png': ['.png'],
                    'image/jpeg': ['.jpg', '.jpeg'],
                  }}
                />
                <YupErrorMessage name="assetCoverCertificate" />

                <RHFCustomFileUploadBox
                  name="valuationReport"
                  label="Valuation Report"
                  accept={{
                    'application/pdf': ['.pdf'],
                    'image/png': ['.png'],
                    'image/jpeg': ['.jpg', '.jpeg'],
                  }}
                />
                <YupErrorMessage name="valuationReport" />
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <RHFTextField
                name="remark"
                label="Remark"
                multiline
                rows={3}
                fullWidth
              />
            </Grid>
          </Grid>
        </FormProvider>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end', gap: 1.5, px: 3, py: 2 }}>
        <Button variant="soft" onClick={onClose}>
          Cancel
        </Button>

        {/* <LoadingButton
          color="error"
          variant="soft"
          loading={isSubmittingApi}
          onClick={() => submitData('REJECTED')}
        >
          Reject
        </LoadingButton> */}

        <LoadingButton
          color="success"
          variant="soft"
          loading={isSubmittingApi}
          onClick={handleSubmit(submitData)}
        >
          Approve
        </LoadingButton>

      </DialogActions>
    </Dialog>
  );
}
