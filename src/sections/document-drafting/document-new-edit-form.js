import { useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, Button, Typography, MenuItem, Card } from '@mui/material';
import { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import slugify from 'slugify';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';

const generateId = () => Math.random().toString(36).substring(2, 10);

const fieldTypes = [
  { label: 'Text', value: 'text' },
  { label: 'Select', value: 'select' },
  { label: 'Section', value: 'section' },
  { label: 'Upload', value: 'upload' },
];

const DocumentFormSchema = Yup.object({
  name: Yup.string().required('Document name is required'),
  description: Yup.string(),
  formFields: Yup.array().of(
    Yup.object({
      id: Yup.string().required(),
      label: Yup.string().required('Label is required'),
      type: Yup.string().oneOf(['text', 'select', 'section', 'upload']).required(),
      requiredFor: Yup.string().nullable(),
      options: Yup.array().when('type', {
        is: 'select',
        then: (schema) => schema.of(
          Yup.object({
            id: Yup.string().required(),
            option: Yup.string().required(),
            value: Yup.string().required(),
            nestedFields: Yup.array(),
          })
        ).min(1, 'At least one option required'),
        otherwise: (schema) => schema.notRequired(),
      }),
    })
  ).min(1, 'At least one field is required'),
});

function FormRenderer({ data, parentPath, control, setValue }) {
  if (!data?.length) return null;

  const addNestedField = (parentId, fields, newField, optionId) =>
    fields.map((f) => {
      if (f.id === parentId) {
        return {
          ...f,
          options: f.options.map((o) =>
            o.id === optionId
              ? { ...o, nestedFields: [...o.nestedFields, newField] }
              : o
          ),
        };
      }
      return {
        ...f,
        options: f.options?.map((o) => ({
          ...o,
          nestedFields: addNestedField(parentId, o.nestedFields || [], newField, optionId),
        })),
      };
    });

  return data.map((field, index) => {
    const path = `${parentPath}[${index}]`;

    return (
      <Card key={field.id} sx={{ p: 2, mb: 2, bgcolor: '#f9f9f9' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <RHFSelect name={`${path}.type`} label="Field Type">
              {fieldTypes.map((t) => (
                <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
              ))}
            </RHFSelect>
          </Grid>

          <Grid item xs={12} md={4}>
            <RHFTextField name={`${path}.label`} label="Label" />
          </Grid>

          {field.type !== 'section' && (
            <Grid item xs={12} md={3}>
              <RHFSelect name={`${path}.requiredFor`} label="Required For">
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="both">Both</MenuItem>
              </RHFSelect>
            </Grid>
          )}

          <Grid item xs={12} md={2}>
            <Button color="error" variant="outlined" onClick={() => {
              setValue('formFields', data.filter((_, i) => i !== index));
            }}>
              Remove
            </Button>
          </Grid>

          {field.type === 'select' && field.options.map((opt, optIndex) => {
            const optPath = `${path}.options[${optIndex}]`;
            return (
              <Grid container key={opt.id} spacing={2} sx={{ pl: 2, mt: 1 }}>
                <Grid item xs={4}><RHFTextField name={`${optPath}.option`} label="Option" /></Grid>
                <Grid item xs={4}><RHFTextField name={`${optPath}.value`} label="Value" /></Grid>
                <Grid item xs={4}>
                  <Button color="error" onClick={() => {
                    field.options.splice(optIndex, 1);
                    setValue('formFields', [...data]);
                  }}>Remove Option</Button>
                </Grid>

                {opt.nestedFields?.length > 0 && (
                  <FormRenderer
                    data={opt.nestedFields}
                    parentPath={`${optPath}.nestedFields`}
                    control={control}
                    setValue={setValue}
                  />
                )}

                {fieldTypes.map((t) => (
                  <Grid item xs={3} key={t.value}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        const newField = {
                          id: generateId(),
                          label: '',
                          type: t.value,
                          requiredFor: '',
                          options: t.value === 'select'
                            ? [{ id: generateId(), option: '', value: '', nestedFields: [] }]
                            : [],
                        };

                        setValue('formFields', addNestedField(field.id, data, newField, opt.id));
                      }}
                    >+ {t.label}</Button>
                  </Grid>
                ))}
              </Grid>
            );
          })}

          {field.type === 'select' && (
            <Button
              sx={{ mt: 2 }}
              onClick={() => {
                field.options.push({ id: generateId(), option: '', value: '', nestedFields: [] });
                setValue('formFields', [...data]);
              }}
            >+ Add Option</Button>
          )}
        </Grid>
      </Card>
    );
  });
}

export default function AdminDocumentFormBuilder({ currentDocument }) {
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(() => ({
    name: currentDocument?.name || '',
    description: currentDocument?.description || '',
    formFields: currentDocument?.formFields || [],
  }), [currentDocument]);

  const methods = useForm({
    resolver: yupResolver(DocumentFormSchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit } = methods;
  const values = watch();

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      value: slugify(data.name, { lower: true }),
      description: data.description,
      formFields: data.formFields,
    };

    try {
      if (currentDocument) {
        await axiosInstance.patch(`/document-types/${currentDocument.id}`, payload);
      } else {
        await axiosInstance.post('/document-types', payload);
      }
      enqueueSnackbar('Document saved successfully');
    } catch (e) {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  return (
    <Card sx={{ p: 4 }}>
      <FormProvider {...methods}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}><RHFTextField name="name" label="Document Name" /></Grid>
          <Grid item xs={12}><RHFTextField name="description" label="Description" multiline rows={3} /></Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Form Fields</Typography>
            <FormRenderer
              data={values.formFields}
              parentPath="formFields"
              control={methods.control}
              setValue={setValue}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">Add Field</Typography>
            <Grid container spacing={2}>
              {fieldTypes.map((t) => (
                <Grid item xs={3} key={t.value}>
                  <Button variant="contained" fullWidth onClick={() => {
                    setValue('formFields', [...values.formFields, {
                      id: generateId(),
                      label: '',
                      type: t.value,
                      requiredFor: '',
                      options: t.value === 'select'
                        ? [{ id: generateId(), option: '', value: '', nestedFields: [] }]
                        : [],
                    }]);
                  }}>+ {t.label}</Button>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} textAlign="right">
            <LoadingButton variant="contained" onClick={handleSubmit(onSubmit)}>
              Save Document
            </LoadingButton>
          </Grid>
        </Grid>
      </FormProvider>
    </Card>
  );
}
