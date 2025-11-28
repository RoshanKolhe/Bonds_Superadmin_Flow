// react
import { useEffect, useMemo, useState } from "react";
import * as Yup from 'yup';
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// components...
import axiosInstance, { endpoints } from "src/utils/axios";
// mui
import { Box, Button, Grid, MenuItem, Typography } from "@mui/material";
import { RHFSelect, RHFTextField } from "src/components/hook-form";

// -----------------------------------------------------------------------------------------------------------
export default function CreateNewTrusteeDocumentDraftNewEditDetails() {
    const [bankData, setBankData] = useState([]);
    const [user, setUser] = useState(null);
    const fieldTypes = [
        { label: 'Text', value: 'text' },
        { label: 'Select', value: 'select' },
        { label: 'Section', value: 'section' },
        { label: 'Upload', value: 'upload' }
    ];

    // fetching user details...
    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get(endpoints.auth.me);
            if (response?.data) {
                setUser(response?.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // fetching bank data...
    const fetchBankData = async () => {
        try {
            const response = await axiosInstance.get('/banks');
            setBankData(response?.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchUser();
        fetchBankData();
    }, [])

    // random id to handle field...
    function generateRandomId() {
        return Math.random().toString(36).substring(2, 12);
    }

    // yup validations...
    const NewInvoiceSchema = Yup.object().shape({
        formName: Yup.string().required("Please enter form name"),
        bankId: Yup.number().required("Please select bank"),
        items: Yup.array().of(
            Yup.object().shape({
                id: Yup.string().required('ID is required'),
                label: Yup.string().required('Label is required'),
                type: Yup.string().required('Type is required'),
                options: Yup.array()
                    .of(
                        Yup.object().shape({
                            id: Yup.string().required('Option ID is required'),
                            option: Yup.string().required('Option is required'),
                            value: Yup.string().required('Value is required'),
                            nestedFields: Yup.array(),
                        })
                    )
                    .when('type', {
                        is: 'Select',
                        then: (schema) => schema.min(1, 'At least one option is required'),
                        otherwise: (schema) => schema.notRequired(),
                    }),
                requiredFor: Yup.string().required("Please Select"),
            })
        ),
    });

    // Initialize default values with empty items
    const defaultValues = useMemo(
        () => ({
            items: [],
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(NewInvoiceSchema),
        defaultValues,
    });

    const { control, setValue, getValues, watch, handleSubmit } = methods;
    const { fields, append, remove, update } = useFieldArray({ control, name: 'items' });
    const values = watch();

    const onSubmit = async (data) => {
        const handleNestedFields = (fieldsData) => fieldsData.map((item) => ({
            id: item.id,
            fieldName: item.label,
            fieldType: item.type,
            requiredFor: item.requiredFor,
            options: item.options?.map((option) => ({
                id: option.id,
                option: option.option,
                value: option.value,
                nestedFields: option.nestedFields?.length > 0 ? handleNestedFields(option.nestedFields) : [],
            })) || [],
        }));

        try {
            const inputData = {
                formName: data.formName,
                fields: handleNestedFields(data.items),  // ✅ Properly transforming nested fields
                isDefaultForm: true,
            };

            const response = await axiosInstance.post('/forms', inputData);
            if (response.data) {
                // Handle success response
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Add New Field...
    const handleAddField = (type) => {
        console.log(type);
        // for normal text field...
        if (type === "text") {
            setValue('items', [...values.items, {
                id: generateRandomId(),
                label: '',
                type: 'text',
                requiredFor: '',
                options: [],
            }])
        }

        // for section...
        // else if(type === 'section'){
        //   setValue('items', [...values.items,{
        //     id: generateRandomId(),
        //     label : '',
        //     type : 'section',
        //     requiredFor : 'both',
        //     options : [],
        //   }], {shouldValidate : true})
        // }

        // for select...
        else if (type === 'select') {
            setValue('items', [...values.items, {
                id: generateRandomId(),
                label: '',
                type: 'select',
                requiredFor: '',
                options: [{
                    id: generateRandomId(),
                    option: '',
                    value: '',
                    nestedFields: [],
                }],
            }], { shouldValidate: true })
        }

        // // for upload...
        // else if(type === 'upload'){
        //   setValue('items', [...values.items,{
        //     id: generateRandomId(),
        //     label : '',
        //     type : 'upload',
        //     requiredFor : '',
        //     options : [],
        //   }], {shouldValidate : true})
        // }
    }

    const handleAddNestedField = (parentId, fieldType, condition) => {
        const newNestedField = {
            id: generateRandomId(),
            label: '',
            type: fieldType,
            requiredFor: '',
            options: fieldType === 'select' ? [{ id: generateRandomId(), option: '', value: '', nestedFields: [], }] : [],
        };

        // Add the new nested field under the correct parent field using the recursive function
        const updatedItems = addNestedField(parentId, values.items, newNestedField, condition);
        setValue('items', updatedItems, { shouldValidate: true });
    };

    const addNestedField = (parentId, data, newField, condition) =>
        data.map((item) => {
            if (item.id === parentId) {
                return {
                    ...item,
                    options: item.options.map((opt) =>
                        opt.id === condition
                            ? {
                                ...opt,
                                nestedFields: [...(opt.nestedFields || []), newField] // Ensure nestedFields is an array
                            }
                            : opt
                    ),
                };
            }

            if (item.options) {
                return {
                    ...item,
                    options: item.options.map((opt) => ({
                        ...opt,
                        nestedFields: addNestedField(parentId, opt.nestedFields || [], newField, condition),
                    })),
                };
            }

            return item;
        });

    // add new option...
    const handleAddOption = (id) => {
        const updatedItems = addOptionRecursively(id, values.items);
        setValue('items', updatedItems, { shouldValidate: true });
    };

    const addOptionRecursively = (id, data) =>
        data.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    options: [
                        ...item.options,
                        {
                            id: generateRandomId(),
                            option: '',
                            value: '',
                            nestedFields: []  // Ensure nestedFields exists
                        }
                    ],
                };
            }

            if (item.options) {
                return {
                    ...item,
                    options: item.options.map((opt) => ({
                        ...opt,
                        nestedFields: addOptionRecursively(id, opt.nestedFields || []), // Ensure nestedFields is always an array
                    })),
                };
            }

            return item;
        });


    // handle remove option...
    const handleRemoveOption = (parentId, optionId) => {
        const updatedItems = goThroughArray(parentId, values.items, optionId);
        setValue('items', updatedItems, { shouldValidate: true });
    };

    const goThroughArray = (parentId, data, optionId) => data.map((item) => {
        if (item.id === parentId) {
            return {
                ...item,
                options: item.options.filter((opt) => opt.id !== optionId),
            };
        }

        if (item.nestedFields && item.nestedFields.length > 0) {
            return {
                ...item,
                nestedFields: goThroughArray(parentId, item.nestedFields, optionId),
            };
        }

        return item;
    });

    // remove field...
    const handleRemoveField = (id) => {
        const updatedItems = removeFieldRecursively(id, getValues("items"));
        setValue("items", updatedItems, { shouldValidate: true });
    };

    const removeFieldRecursively = (id, data) =>
        data.filter((item) => item.id !== id).map((item) => ({
            ...item,
            options: item.options.map((opt) => ({
                ...opt,
                nestedFields: removeFieldRecursively(id, opt.nestedFields || []),
            })),
        }));

    const formStructure = (data, parentPath, isNested) => {
        if (!data || data.length === 0) return null;

        return data.map((field, index) => {
            // Generate the current field path
            const fieldPath = `${parentPath}[${index}]`;

            return (
                <Grid
                    container
                    spacing={2}
                    sx={{
                        p: 2,
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        backgroundColor: '#f9f9f9',
                        mb: 2,
                        mt: isNested ? 2 : '',
                        pl: isNested ? 2 : ''
                    }}
                    key={field.id}
                >
                    {/* Field Type */}
                    <Grid item xs={12} md={3}>
                        <RHFTextField name={`${fieldPath}.type`} label="Field Type" disabled />
                    </Grid>

                    {/* Field Name */}
                    <Grid item xs={12} md={3}>
                        <RHFTextField name={`${fieldPath}.label`} label="Field Name" />
                    </Grid>

                    {/* Required */}
                    {field.type !== 'section' && (
                        <Grid item xs={12} md={3}>
                            <RHFSelect name={`${fieldPath}.requiredFor`} label="Required">
                                <MenuItem value='advocate'>For Advocate</MenuItem>
                                <MenuItem value='valuator'>For Valuator</MenuItem>
                                <MenuItem value='both'>For Valuator & Advocate</MenuItem>
                                <MenuItem value='customer'>For Customer</MenuItem>
                                <MenuItem value='none'>none</MenuItem>
                            </RHFSelect>
                        </Grid>
                    )}

                    {/* Remove Field */}
                    <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button onClick={() => handleRemoveField(field.id)} variant="outlined" color="error">
                            - Remove Field
                        </Button>
                    </Grid>

                    {/* Options for Select Field */}
                    {field.type === 'select' && Array.isArray(field.options) && field.options.length > 0 && (
                        field.options.map((opt, optIndex) => {
                            // Generate the nested path for options
                            const optionPath = `${fieldPath}.options[${optIndex}]`;

                            return (
                                <Grid
                                    container
                                    key={opt.id}
                                    spacing={1.5}
                                    sx={{ pl: 2, borderLeft: '3px solid #ccc', my: 1 }}
                                >
                                    {/* Option Name */}
                                    <Grid item xs={4} md={4}>
                                        <RHFTextField name={`${optionPath}.option`} label="Option" />
                                    </Grid>

                                    {/* Option Value */}
                                    <Grid item xs={4} md={4}>
                                        <RHFTextField name={`${optionPath}.value`} label="Value" />
                                    </Grid>

                                    {/* Remove Option */}
                                    <Grid item xs={4} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Button
                                            onClick={() => handleRemoveOption(field.id, opt.id)}
                                            variant="contained"
                                            color="error"
                                        >
                                            Remove
                                        </Button>
                                    </Grid>

                                    {/* Recursive Call for Nested Fields */}
                                    {opt.nestedFields && opt.nestedFields.length > 0 && (
                                        formStructure(opt.nestedFields, `${optionPath}.nestedFields`, true)
                                    )}

                                    {/* Add Nested Field Button */}
                                    {field.type === 'select' && fieldTypes.map((type) => (
                                        <Grid key={type.value} item xs={6} md={3}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleAddNestedField(field.id, type.value, opt.id)}
                                            >
                                                + {type.label}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            );
                        })
                    )}

                    {/* Add Option Button */}
                    {field.type === 'select' && (
                        <Grid item xs={12} md={3}>
                            <Button
                                variant="contained"
                                sx={{ mt: 1 }}
                                onClick={() => handleAddOption(field.id)}
                            >
                                + Add Option
                            </Button>
                        </Grid>
                    )}
                </Grid>
            );
        });
    };

    return (
        <Box sx={{ p: 4 }}>
            <FormProvider {...methods}>
                <Grid container spacing={3}>
                    {/* Form Name */}
                    <Grid item xs={6} md={6}>
                        <RHFTextField name="trustName" label="Trust Name" />
                    </Grid>

                    {/* Select Bank */}
                    <Grid item xs={6} md={6}>
                        <RHFTextField name="documentType" label="Document Type" />
                    </Grid>

                    {/* Form Structure */}
                    <Grid item xs={12}>
                        <Typography variant="h5" sx={{ mb: 2 }}>Form Structure</Typography>
                        {values.items.length > 0 &&
                            formStructure(values.items, 'items', false)
                        }
                    </Grid>

                    {/* Buttons to Add New Fields */}
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Add New Field</Typography>
                        <Grid container spacing={2}>
                            {fieldTypes.map((type) => (
                                <Grid key={type.value} item xs={6} md={3}>
                                    <Button variant="contained" fullWidth onClick={() => handleAddField(type.value)}>
                                        + {type.label}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
                <Box component='div' sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Button
                        type="submit"
                        color="success"
                        variant="contained"
                        onClick={handleSubmit(onSubmit)}
                        sx={{ mt: 3 }}
                    >
                        Submit
                    </Button>
                </Box>
            </FormProvider>
        </Box>
    );
}