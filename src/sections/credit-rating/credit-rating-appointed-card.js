/* eslint-disable no-useless-escape */
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Grid,
    Typography,
    Radio,
    FormControlLabel,
    MenuItem,
    Card,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
} from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFCustomFileUploadBox, RHFSelect, RHFTextField } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { DatePicker } from '@mui/x-date-pickers';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import { useGetCreditRatingAgencies, useGetCreditRatings } from 'src/api/creditRatingsAndAgencies';
import { useParams } from 'src/routes/hook';
import { format, isDate } from 'date-fns';
import { h } from '@fullcalendar/core/preact';

export default function CreditRatingApprovalCard({ open, onClose, applicationId, creditRatingAgencyId }) {

    console.log(' Id CreditAgencyId:', creditRatingAgencyId);
    const [agenciesData, setAgenciesData] = useState([]);
    const [ratingsData, setRatingsData] = useState([]);
    const { creditRatingAgencies, creditRatingAgenciesLoading } = useGetCreditRatingAgencies();
    const { creditRatings, creditRatingsLoading } = useGetCreditRatings();
    const { enqueueSnackbar } = useSnackbar();

    const newCreditRatingSchema = Yup.object().shape({
        selectedAgency: Yup.object().required('Please select agency'),
        selectedRating: Yup.object().required('Please select rating'),
        validFrom: Yup.string().required('Valid from is required'),
        creditRatingLetter: Yup.mixed().required('Credit rating letter required'),

    });

    const defaultValues = useMemo(
        () => ({
            selectedAgency: null,
            selectedRating: null,
            validFrom: '',
            creditRatingLetter: null,

        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(newCreditRatingSchema),
        defaultValues,
    });

    const {
        control,
        watch,
        setValue,
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    useEffect(() => {
        if (creditRatingAgencyId && agenciesData.length) {
            const agency = agenciesData.find(
                (a) => a.id === creditRatingAgencyId
            );

            if (agency) {
                setValue('selectedAgency', agency, {
                    shouldValidate: true,
                });
            }
        }
    }, [creditRatingAgencyId, agenciesData, setValue]);

    const onApprove = async (data) => {
        try {
            const payload = {
                creditRatingAgencyId: creditRatingAgencyId,
                approval: {
                    validFrom: new Date(data.validFrom).toISOString(),
                    isActive: true,
                    isDeleted: false,
                    bondIssueApplicationId: applicationId,
                    creditRatingsId: data.selectedRating?.id,
                    ratingLetterId: data.creditRatingLetter?.id,
                    creditRatingAgenciesId: data.selectedAgency?.id,
                },
            };
            console.log('✅ Approval Payload:', payload);
            await axiosInstance.post(
                `/bonds-pre-issue/approval/credit-rating-approval/${applicationId}`,
                payload
            );
            enqueueSnackbar('Approved successfully', { variant: 'success' });
            onClose();
        } catch (error) {
            enqueueSnackbar(error.error.message, { variant: 'error' });
        }
    };

    useEffect(() => {
        if (creditRatingAgencies && !creditRatingAgenciesLoading) {
            setAgenciesData(creditRatingAgencies);
        }
    }, [creditRatingAgencies, creditRatingAgenciesLoading]);

    useEffect(() => {
        if (creditRatings && !creditRatingsLoading) {
            setRatingsData(creditRatings);
        }
    }, [creditRatings, creditRatingsLoading]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            scroll="paper"
        >
            <DialogTitle sx={{ fontWeight: 600 }}>
                Credit Rating Details
            </DialogTitle>

            <DialogContent dividers>
                <FormProvider methods={methods} >
                    <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                            Credit Ratings Available
                        </Typography>

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4}>
                                <RHFAutocomplete
                                    name="selectedAgency"
                                    label="Credit Rating Agency"
                                    options={agenciesData || []}
                                    getOptionLabel={(option) => option.name}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    disabled   // 🔒 ALWAYS LOCKED
                                />

                            </Grid>

                            <Grid item xs={12} md={8}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                    Rating
                                </Typography>
                                <Grid container spacing={2}>
                                    {ratingsData.map((rating) => (
                                        <Grid item xs={4} key={rating.id}>
                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        checked={values.selectedRating?.id === rating?.id}
                                                        onChange={() =>
                                                            setValue('selectedRating', rating, { shouldValidate: true })
                                                        }
                                                    />
                                                }
                                                label={rating.name}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                                <YupErrorMessage name="selectedRating" />
                            </Grid>
                        </Grid>

                        <Controller
                            name="validFrom"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <DatePicker
                                    sx={{ mb: 2 }}
                                    {...field}
                                    label="Valid From"
                                    value={
                                        field.value
                                            ? field.value instanceof Date
                                                ? field.value
                                                : new Date(field.value)
                                            : null
                                    }
                                    onChange={(newValue) => field.onChange(newValue)}
                                    format="dd/MM/yyyy"
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

                        <RHFCustomFileUploadBox
                            name="creditRatingLetter"
                            label="Upload Credit Rating Letter"
                            icon="mdi:file-document-outline"
                            maxSizeMB={2}
                        />
                        <YupErrorMessage name="creditRatingLetter" />
                    </Card>
                </FormProvider>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'flex-end', gap: 1.5, px: 3, py: 2 }}>
                <Button variant="soft" onClick={onClose}>
                    Cancel
                </Button>

                {/* <Button
                    variant="soft"
                    color="error"
                    loading={isSubmittingApi}
                    onClick={() => submitData('REJECTED')}
                >
                    Reject
                </Button> */}

                <Button
                    variant="soft"
                    color="success"
                    loading={isSubmitting}
                    onClick={handleSubmit(onApprove)}>
                    Approve
                </Button>
            </DialogActions>
        </Dialog>
    );
}

CreditRatingApprovalCard.propTypes = {
    setPercent: PropTypes.func,
    setProgress: PropTypes.func,
};
