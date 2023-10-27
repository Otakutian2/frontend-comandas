import ComboBox from "@/components/ComboBox";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import employeeSchema from "@/schemas/Employee";
import Swal from "sweetalert2";
import { IEmployeeGet, IEmployeeCreateOrUpdate } from "@/interfaces/IEmployee";
import { IRoleGet } from "@/interfaces/IRole";
import { IFormProps } from "@/interfaces/IFormProps";
import { Formik } from "formik";
import { useSWRConfig } from "swr";
import { createObject } from "@/services/HttpRequests";
import { onlyNumber, theme } from "@/utils";
import { ThemeProvider } from "@mui/material/styles";
import { showSuccessToastMessage } from "@/lib/Messages";
import { AxiosError } from "axios";

const initialValues: IEmployeeCreateOrUpdate = {
  firstName: "",
  lastName: "",
  phone: "",
  dni: "",
  user: {
    email: "",
  },
};

interface IEmployeeAddFormProps extends IFormProps<IEmployeeCreateOrUpdate> {
  data: IRoleGet[];
}

const EmployeeAddForm = ({ customRef, data }: IEmployeeAddFormProps) => {
  const { mutate } = useSWRConfig();

  return (
    <ThemeProvider theme={theme}>
      <Formik<IEmployeeCreateOrUpdate>
        initialValues={initialValues}
        innerRef={customRef}
        validateOnChange={false}
        validationSchema={employeeSchema}
        onSubmit={async (newEmployee) => {
          try {
            await createObject<IEmployeeGet, IEmployeeCreateOrUpdate>(
              "api/employee",
              newEmployee
            );
            mutate("api/employee");

            showSuccessToastMessage(
              "El empleado se ha registrado correctamente"
            );
          } catch (err) {
            const error = err as AxiosError;
            Swal.showValidationMessage(error.response?.data as string);
          }
        }}
      >
        {({
          values,
          errors,
          handleChange,
          setFieldValue,
          isSubmitting,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1.5} marginY={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="firstName"
                  type="text"
                  label="Nombres"
                  error={Boolean(errors.firstName)}
                  value={values.firstName}
                  onChange={handleChange}
                  helperText={errors.firstName}
                  disabled={isSubmitting}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  id="lastName"
                  type="text"
                  label="Apellidos"
                  error={Boolean(errors.lastName)}
                  value={values.lastName}
                  onChange={handleChange}
                  helperText={errors.lastName}
                  disabled={isSubmitting}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  id="phone"
                  type="text"
                  label="Teléfono"
                  error={Boolean(errors.phone)}
                  value={values.phone}
                  onChange={handleChange}
                  onKeyDown={onlyNumber}
                  helperText={errors.phone}
                  disabled={isSubmitting}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  id="email"
                  type="email"
                  label="Correo Electrónico"
                  error={Boolean(errors.user?.email)}
                  value={values.user?.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue("user.email", e.target.value);
                  }}
                  helperText={errors.user?.email}
                  disabled={isSubmitting}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  id="dni"
                  type="text"
                  label="DNI"
                  error={Boolean(errors.dni)}
                  value={values.dni}
                  onChange={handleChange}
                  onKeyDown={onlyNumber}
                  helperText={errors.dni}
                  disabled={isSubmitting}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ComboBox
                  id="id"
                  label="name"
                  values={data}
                  textFieldProps={{
                    label: "Rol",
                    error: Boolean(errors.roleId),
                    helperText: errors.roleId,
                    disabled: isSubmitting,
                  }}
                  disabled={isSubmitting}
                  handleChange={(role: IRoleGet | null) => {
                    setFieldValue("roleId", role?.id);
                  }}
                />
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </ThemeProvider>
  );
};

export default EmployeeAddForm;
