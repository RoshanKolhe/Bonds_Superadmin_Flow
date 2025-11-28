import { useEffect, useMemo, useState } from "react";
import {
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from 'src/components/snackbar';
import { Grid, Button, Typography, Checkbox, FormControlLabel, IconButton, Stack, MenuItem } from "@mui/material";
import * as Yup from "yup";
import FormProvider, { RHFAutocomplete, RHFEditor, RHFSelect, RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";
import { LoadingButton } from "@mui/lab";
import { paths } from "src/routes/paths";
import { useNavigate } from "react-router";
import axiosInstance from "src/utils/axios";
import { useRouter } from "src/routes/hook";
import slugify from "slugify";
import { useGetRoles } from "src/api/role";
import { object } from "prop-types";


const requiredOptions = [
  { label: "False", value: false },
  { label: "True", value: true },

];




function RenderFields({ name }) {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  const values = watch(name);


  useEffect(() => {
    if (!values?.length) {
      append({

        fieldName: "",
        fieldValue: "",
        description: "",
        isRequired: true,
      });
    }
  }, [values, append]);

  return (
    <Grid container direction="column" spacing={2} sx={{ mt: 2 }}>
      {fields.map((field, index) => {
        const fieldPath = `${name}[${index}]`;

        return (
          <Grid
            key={field.id}
            item
            xs={12}
            sx={{ p: 2, backgroundColor: "#f6f6f6", borderRadius: 1 }}
          >
            <Grid container spacing={2}>
              {/* Label */}
              <Grid item xs={12} sm={6}>
                <RHFTextField name={`${fieldPath}.fieldName`} label="Label" />
              </Grid>

              {/* Value */}
              <Grid item xs={12} sm={6}>
                <RHFTextField name={`${fieldPath}.fieldValue`} label="Value" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name={`${fieldPath}.description`} label="Description" />
              </Grid>

              {/* Required Checkbox */}
              <Grid item xs={12} sm={6}>
                <RHFSelect
                  name={`${fieldPath}.isRequired`}
                  label="Required"

                  fullWidth
                >
                  {requiredOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>

              {values?.length > 1 && (
                <Grid item xs={12} sm={1}>
                  <IconButton
                    color="error"
                    onClick={() => remove(index)}
                    sx={{ ml: "auto" }}
                  >
                    <Iconify icon="mdi:trash-outline" width={22} />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          </Grid>

        );
      })}

      {/* Add Field Button */}
      <Grid item>
        <Button
          variant="outlined"
          size="small"
          type="button"
          onClick={() =>
            append({
              fieldName: "",
              fieldValue: "",
              description: "",
              isRequired: true,
            })
          }
        >
          + Add Field
        </Button>
      </Grid>
    </Grid >
  );
}


export default function DocumentFields({ currentFields }) {

  const DocumentFieldSchema = Yup.object().shape({
    roles: Yup.array().of(
      Yup.object().required('Role is required')
    ).min(1, 'Atleast one role is rquired'),
    name: Yup.string().required("Document type is required"),
    description: Yup.string(),
    documentPlaceholders: Yup.array()
      .of(
        Yup.object().shape({
          fieldName: Yup.string().required("Field label is required"),
          fieldValue: Yup.string().required("Field value is required"),
          description: Yup.string().required("description is required"),
          isRequired: Yup.boolean().default(true),
        })
      )
      .min(1, "At least one field is required"),
  });

  const [getRoles, setGetRoles] = useState([]);
  const { roles, rolesEmpty } = useGetRoles();

  useEffect(() => {
    if (roles && !rolesEmpty) {
      setGetRoles(roles);
    } else {
      setGetRoles([]);
    }
  }, [roles, rolesEmpty]);

  const defaultValues = useMemo(
    () => ({
      roles: currentFields?.roles || [],
      name: currentFields?.name || "",
      value: currentFields?.value || '',
      description: currentFields?.description || "",
      documentPlaceholders: currentFields?.documentPlaceholders?.length
        ? currentFields.documentPlaceholders.map((item) => ({
          fieldName: item.fieldName || "",
          fieldValue: item.fieldValue || "",
          description: item.description || "",
          isRequired: item.isRequired ?? true,
        }))
        : [
          {
            fieldName: "",
            fieldValue: "",
            description: "",
            isRequired: true,
          },
        ],
    }),
    [currentFields]
  );


  const methods = useForm({
    resolver: yupResolver(DocumentFieldSchema),
    defaultValues,
    mode: "onChange",
  });


  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const nameValue = watch("name");

  useEffect(() => {
    if (nameValue) {
      const generatedSlug = slugify(nameValue, {
        lower: true,
        strict: true,
        trim: true,
      });

      methods.setValue("value", generatedSlug);
    }
  }, [nameValue, methods]);


  const { enqueueSnackbar } = useSnackbar();
  const { router } = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const inputData = {
        roles: formData?.roles?.map((role) => role.id),
        name: formData.name,
        value: slugify(formData.name, { lower: true, strict: true, trim: true }),
        description: formData.description || "",
        documentPlaceholders: formData.documentPlaceholders.map(item => ({
          fieldName: item.fieldName,
          fieldValue: item.fieldValue,
          description: item.description,
          isRequired: item.isRequired,
        })),
      };

      if (!currentFields) {
        await axiosInstance.post('/document-types/', inputData);
      } else {
        await axiosInstance.patch(`/document-types/${currentFields.id}`, inputData);
      }

      reset();
      enqueueSnackbar(
        currentFields ? 'Document updated successfully!' : 'Document created successfully!'
      );
      // router.push(paths.dashboard.debenturetrustees.debenturetrusteeslist);
    } catch (error) {
      console.error(error);

      const message =
        error?.error?.message ||
        error?.message ||
        error?.message ||
        "Something went wrong";

      enqueueSnackbar(message, { variant: "error" });
    }
  });



  useEffect(() => {
    if (currentFields) {
      reset(defaultValues);
    }
  }, [currentFields, defaultValues, reset]);



  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>

      <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
        <Grid item xs={12} md={4}>
          <RHFAutocomplete
            name="roles"
            label="Select Roles"
            autoHighlight
            multiple
            disableClearable={false}
            options={getRoles}
            getOptionLabel={(option) => option?.label || ''}
            filterOptions={(x) => x}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
          />
        </Grid>
        <Grid item xs={12}>
          <RHFTextField name="name" label="Document Type" fullWidth />
        </Grid>

        <Grid item xs={12} >
          <RHFTextField
            name="description"
            label="Description"
            multiline
            rows={4}

          />
        </Grid>
      </Grid>


      <Typography variant="h6">Fields</Typography>

      <RenderFields name="documentPlaceholders" />
      <Stack
        alignItems="flex-end"
        sx={{ mt: 3, display: "flex", gap: "10px" }}
      >
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {currentFields ? 'Save Changes' : 'Create Document'}
        </LoadingButton>

      </Stack>


    </FormProvider >
  );
}
