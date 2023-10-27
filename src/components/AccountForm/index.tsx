import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import ContentBox from "@/components/ContentBox";
import dayjs from "dayjs";
import Title from "@/components/Title";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useUserStore } from "@/store/user";

const AccountForm = () => {
  const user = useUserStore((state) => state.user);
  const date_created_at = dayjs(user!.createdAt);

  return (
    <ContentBox
      sxProps={{
        padding: 2,
      }}
    >
      <Title variant="h2">Mi Información</Title>

      <Grid
        container
        spacing={2}
        sx={{ alignItems: "center", justifyContent: "center" }}
      >
        <Grid item sx={{ flexGrow: 1 }}>
          <Avatar
            sx={{ width: "80px", height: "auto", margin: "auto" }}
            alt="avatar"
            src={user?.image}
          />
        </Grid>
        <Grid item sx={{ flexGrow: "7 !important" }} xs={12} sm>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nombres"
                  defaultValue={user?.firstName}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth={true}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Apellidos"
                  defaultValue={user?.lastName}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth={true}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Teléfono"
                  defaultValue={user?.phone}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth={true}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Correo Eletrónico"
                  defaultValue={user?.user.email}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth={true}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Role"
                  defaultValue={user?.role.name}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth={true}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="DNI"
                  defaultValue={user?.dni}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth={true}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <DateTimePicker
                  label="Fecha de creción"
                  format="DD/MM/YYYY hh:mm"
                  defaultValue={date_created_at}
                  readOnly
                  slotProps={{
                    textField: { variant: "outlined", fullWidth: true },
                  }}
                />
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </ContentBox>
  );
};

export default AccountForm;
