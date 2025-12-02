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


const fieldTypes = [
  { label: 'Text', value: 'text' },
  { label: 'Select', value: 'select' }
]


function OptionsField({ name }) {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  // Watch this field options array
  const optionValues = watch(name) || [];

  // Auto-add first option if none exist
  useEffect(() => {
    if (optionValues.length === 0 && fields.length === 0) {
      append({ option: "", value: "" });
    }
  }, [optionValues.length, fields.length, append]);

  return (
    <Grid container spacing={2} sx={{ p: 2, background: "#f6f6f6", borderRadius: 1 }}>

      {fields.map((item, index) => {
        const path = `${name}[${index}]`;
        return (
          <Grid container spacing={2} key={item.id} alignItems="center">
            <Grid item xs={5}>
              <RHFTextField name={`${path}.option`} label="Option" />
            </Grid>

            <Grid item xs={5}>
              <RHFTextField name={`${path}.value`} label="Option Value" />
            </Grid>
            {optionValues?.length > 1 &&
              <Grid item xs={2}>
                <IconButton color="error" onClick={() => remove(index)}>
                  <Iconify icon="mdi:trash-outline" />
                </IconButton>
              </Grid>
            }
          </Grid>
        );
      })}

      <Grid item xs={12}>
        <Button
          variant="outlined"
          size="small"
          type="button"
          onClick={() => append({ option: "", value: "" })}
        >
          + Add Option
        </Button>
      </Grid>
    </Grid>
  );
}




function RenderFields({ name }) {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  const values = watch(name);

  useEffect(() => {
    if (!values?.length) {
      append({
        fieldType: "",
        fieldName: "",
        fieldValue: "",
        description: "",
        isRequired: true,
        options: [],
      });
    }
  }, [values, append]);

  return (
    <Grid container direction="column" spacing={2} sx={{ mt: 2 }}>
      {fields.map((field, index) => {
        const fieldPath = `${name}[${index}]`;
        const isfieldType = watch(`${fieldPath}.fieldType`);



        return (
          <Grid key={field.id} item xs={12} sx={{ p: 2, backgroundColor: "#f6f6f6", borderRadius: 1 }}>
            <Grid container spacing={2}>

              {/* Label */}
              <Grid item xs={12} sm={4}>
                <RHFTextField name={`${fieldPath}.fieldName`} label="Label" />
              </Grid>

              {/* Value */}
              <Grid item xs={12} sm={4}>
                <RHFTextField name={`${fieldPath}.fieldValue`} label="Value" />
              </Grid>

              {/* Description */}
              <Grid item xs={12} sm={4}>
                <RHFTextField name={`${fieldPath}.description`} label="Description" />
              </Grid>

              {/* Field Type */}
              <Grid item xs={12} sm={4}>
                <RHFSelect name={`${fieldPath}.fieldType`} label="Field Type">
                  {fieldTypes.map((option) => (
                    <MenuItem key={String(option.value)} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>

              {/* Required */}
              <Grid item xs={12} sm={4}>
                <RHFSelect name={`${fieldPath}.isRequired`} label="Required" fullWidth>
                  {requiredOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>

              {/* Delete Field Button */}
              {values?.length > 1 && (
                <Grid item xs={12} sm={2} display="flex" alignItems="center" justifyContent="flex-end">
                  <IconButton color="error" onClick={() => remove(index)}>
                    <Iconify icon="mdi:trash-outline" width={22} />
                  </IconButton>
                </Grid>
              )}

              {/* Dynamic options if type = select */}
              {isfieldType === "select" && (
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Select Options
                  </Typography>

                  <OptionsField name={`${fieldPath}.options`} />
                </Grid>
              )}
            </Grid>
          </Grid>
        );
      })}

      {/* Add New Field Button */}
      <Grid item>
        <Button
          variant="outlined"
          size="small"
          type="button"
          onClick={() =>
            append({
              fieldType: "",
              fieldName: "",
              fieldValue: "",
              description: "",
              isRequired: true,
              options: [],
            })
          }
        >
          + Add Field
        </Button>
      </Grid>
    </Grid>
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
          description: Yup.string().required("Description is required"),
          fieldType: Yup.string()
            .oneOf(["text", "select"], "Invalid field type")
            .required("Field type is required"),
          isRequired: Yup.boolean().default(true),
          options: Yup.array().when("fieldType", {
            is: "select",
            then: (schema) =>
              schema
                .of(
                  Yup.object().shape({
                    option: Yup.string().required("Option label is required"),
                    value: Yup.string().required("Option value is required"),
                  })
                )
                .min(1, "At least one option is required"),
            otherwise: (schema) => schema.optional().notRequired(),
          }),
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
          fieldType: item.fieldType || "text",
          isRequired: item.isRequired ?? true,
          options: item.options || [],
        }))
        : [
          {
            fieldName: "",
            fieldValue: "",
            description: "",
            fieldType: "text",
            isRequired: true,
            options: [],
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

  const navigate = useNavigate();
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
          fieldType: item.fieldType,
          isRequired: item.isRequired,
          options:
            item.fieldType === "select"
              ? item.options.map((opt) => ({
                option: opt.option,
                value: opt.value,
              }))
              : [],
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

      navigate(paths.dashboard.debenturetrustees.debenturetrusteeslist);

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
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
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
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField
              name="name"
              label="Document Type"
              fullWidth
            />
          </Grid>
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

      <Typography variant="h6">Placeholders</Typography>

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
