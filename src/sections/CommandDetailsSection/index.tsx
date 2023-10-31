import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { APP_ROUTES } from "@/routes";
import useSWR, { useSWRConfig } from "swr";
import { ITableGet } from "@/interfaces/ITable";
import {
  createObject,
  deleteObject,
  getObject,
  updateObject,
} from "@/services/HttpRequests";
import ContentBox from "@/components/ContentBox";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Title from "@/components/Title";
import ReplyIcon from "@mui/icons-material/Reply";
import SaveIcon from "@mui/icons-material/Save";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import DeleteIcon from "@mui/icons-material/Delete";
import CommandAddForm from "@/features/Command/CommandAddForm";
import { useUserStore } from "@/store/user";
import {
  ICommandCreate,
  ICommandDetailsCreate,
  ICommandDetailsGet,
  ICommandGet,
  ICommandPrincipal,
  ICommandUpdate,
} from "@/interfaces/ICommand";
import ContentCenter from "@/components/ContentCenter";
import LoaderComponent from "@/components/LoaderComponent";
import CommandDetailsAddForm from "@/features/Command/CommandDetailsAddForm";
import ButtonAdd from "@/components/ButtonAdd";
import useOpenClose from "@/hooks/useOpenClose";
import CommandDetailsTable from "@/features/Command/CommandDetailsTable";
import {
  showErrorMessage,
  showQuestionMessage,
  showSuccessToastMessage,
  showWarningMessage,
} from "@/lib/Messages";
import CommandDetailsUpdateForm from "@/features/Command/CommandDetailsUpdateForm";
import CommandDetailsInformation from "@/features/Command/CommandDetailsInformactionForm";
import { FormikProps } from "formik";
import { AxiosError } from "axios";
import { showForm } from "@/lib/Forms";
import DeleteForever from "@mui/icons-material/DeleteForever";
import SetMealIcon from "@mui/icons-material/SetMeal";
import Typography from "@mui/material/Typography";
import axiosObject from "@/services/Axios";
import ReceiptSection from "../ReceiptSection";
import UserRoles from "@/interfaces/UserRoles";

const CommandDetailsSection = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const role = user?.role.name as UserRoles;
  const canManageCommand = role === "Administrador" || role === "Mesero";
  const canViewCommand =
    canManageCommand || role == "Cajero" || role == "Cocinero";

  if (router.query.id === undefined) return null;

  const id = (router.query.id as string).toLowerCase();

  if ((!canManageCommand && id === "new") || !canViewCommand) {
    router.push(APP_ROUTES.error403);
    return null;
  }

  if (!(id.match(/^[0-9]+$/) || id === "new")) {
    router.push(APP_ROUTES.command);
    return null;
  }

  const tableId = router.query.tableId as string | undefined;

  if (tableId !== undefined && !tableId.match(/^[0-9]+$/)) {
    router.push(APP_ROUTES.command);
    return null;
  }

  return (
    <CommandDetailsSectionContent
      id={id}
      tableId={tableId ? parseInt(tableId) : undefined}
    />
  );
};

const CommandDetailsSectionContent = ({
  id,
  tableId,
}: {
  id?: number | string;
  tableId?: number;
}) => {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { data: table, isLoading: isLoadingTable } = useSWR(
    tableId ? `api/table/${tableId}` : null,
    () => (tableId ? getObject<ITableGet>(`api/table/${tableId}`) : null)
  );
  const [command, setCommand] = useState<ICommandGet | null>(null);
  const [isLoadingCommand, setIsLoadingCommand] = useState<boolean>(true);

  const [openAddForm, openAddFormDialog, closeAddFormDialog] =
    useOpenClose(false);
  const [openUpdateForm, openUpdateFormDialog, closeUpdateFormDialog] =
    useOpenClose(false);
  const [
    openInformationForm,
    openInformationFormDialog,
    closeInformationFormDialog,
  ] = useOpenClose(false);

  const [openReceiptForm, openReceiptFormDialog, closeReceiptFormDialog] =
    useOpenClose(false);
  const [commandDetailsSelected, setCommandDetailsSelected] =
    useState<ICommandDetailsGet | null>(null);
  const [commandDetailsCollection, setCommandDetailsCollection] = useState<
    ICommandDetailsGet[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const totalOrderPrice = commandDetailsCollection
    ? commandDetailsCollection.reduce((acc, curr) => acc + curr.orderPrice, 0)
    : 0;
  const formikRef = useRef<FormikProps<ICommandPrincipal>>(null);

  const [initialCommandDetailsCollection, setInitialCommandDetailsCollection] =
    useState<ICommandDetailsGet[]>([]);
  const [change, setChange] = useState<boolean>(false);

  const role = user?.role.name as UserRoles;
  const canManageCommand = role === "Administrador" || role === "Mesero";
  const canGenerateReceipt = role === "Administrador" || role === "Cajero";
  const canChangeState = role === "Administrador" || role === "Cocinero";

  useEffect(() => {
    if (id === "new") {
      setIsLoadingCommand(false);
      return;
    }

    fetchCommand();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (table?.state === "Ocupado") {
      showErrorMessage({
        title: "Mesa Ocupada",
        contentHtml: "Eliga una mesa, Libre",
      });

      router.push(APP_ROUTES.command);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  // Detectando cambios en la comanda
  useEffect(() => {
    if (commandDetailsCollection.length === 0) {
      if (id === "new") {
        setChange(false);
      }

      return;
    }

    const seatCount = formikRef.current?.values.seatCount;
    if (command?.seatCount && seatCount !== command.seatCount) {
      setChange(true);
      console.log("Hubo cambios en el asiento");
      return;
    }

    if (
      commandDetailsCollection.length !== initialCommandDetailsCollection.length
    ) {
      setChange(true);
      console.log("Hubo cambios en el plato");
      return;
    }

    const changeInCommandDetailsCollection =
      initialCommandDetailsCollection.findIndex((item) => {
        const commandDetails = commandDetailsCollection.find(
          (commandDetailsCollection) =>
            commandDetailsCollection.dish.id === item.dish.id
        );

        return (
          commandDetails?.dishQuantity !== item.dishQuantity ||
          commandDetails?.observation != item.observation
        );
      });

    if (changeInCommandDetailsCollection !== -1) {
      setChange(true);
      console.log("Hubo cambios en los detalles");
      return;
    }

    setChange(false);
    console.log("No hubo cambios");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandDetailsCollection]);

  useEffect(() => {
    const handleReloadAndClose = (e: BeforeUnloadEvent) => {
      if (change) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleReloadAndClose);

    return () => {
      window.removeEventListener("beforeunload", handleReloadAndClose);
    };
  }, [change]);

  const showCommmandNotFoundAndRedirect = () => {
    showErrorMessage({
      title: "COMANDA NO ENCONTRADA",
      contentHtml: "La comanda no existe",
    });

    router.push(APP_ROUTES.command);
  };

  const fetchCommand = async () => {
    try {
      const res = await getObject<ICommandGet>(`api/command/${id}`);

      if (res.commandState.name === "Pagado") {
        showCommmandNotFoundAndRedirect();
        return;
      }

      if (res.commandState.name === "Generado" && role === "Cajero") {
        router.push(APP_ROUTES.error403);
        return;
      }

      setCommand(res);
      setCommandDetailsCollection(res.commandDetailsCollection);
      setInitialCommandDetailsCollection(
        JSON.parse(JSON.stringify(res.commandDetailsCollection))
      );
      setChange(false);
      setIsLoadingCommand(false);
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 404) {
        showCommmandNotFoundAndRedirect();
      }
    }
  };

  const saveCommand = async () => {
    if (commandDetailsCollection.length === 0) {
      setLoading(false);
      formikRef.current?.setSubmitting(false);
      showErrorMessage({
        title: "NO SE PUEDE GUARDAR COMANDA",
        contentHtml: "La comanda debe tener al menos un plato",
      });
      return;
    }

    const commandDetailsCollectionCreate: ICommandDetailsCreate[] =
      commandDetailsCollection.map((commandDetails) => {
        return {
          dishId: commandDetails.dish.id,
          dishQuantity: commandDetails.dishQuantity,
          observation: commandDetails.observation?.trim(),
        };
      });

    if (command) {
      await updateCommand(commandDetailsCollectionCreate);
    } else {
      await createCommand(commandDetailsCollectionCreate);
    }
  };

  const createCommand = async (
    commandDetailsCollectionCreate: ICommandDetailsCreate[]
  ) => {
    const command: ICommandCreate = {
      tableRestaurantId: tableId,
      seatCount: formikRef.current?.values.seatCount,
      commandDetailsCollection: commandDetailsCollectionCreate,
    };

    try {
      const result = await createObject<ICommandGet, ICommandCreate>(
        `api/command`,
        command
      );

      mutate("api/table/commands");
      setChange(false);

      showSuccessToastMessage("La comanda ha sido creada correctamente");
      await router.push(`${APP_ROUTES.command}/${result.id}`);
    } catch (err) {
      const error = err as AxiosError;
      showErrorMessage({ title: error.response?.data as string });
    } finally {
      setLoading(false);
      formikRef.current?.setSubmitting(false);
    }
  };

  const updateCommand = async (
    commandDetailsCollectionCreate: ICommandDetailsCreate[]
  ) => {
    const command: ICommandUpdate = {
      seatCount: formikRef.current?.values.seatCount,
      commandDetailsCollection: commandDetailsCollectionCreate,
    };

    try {
      await updateObject<ICommandGet, ICommandUpdate>(
        `api/command/${id}`,
        command
      );
      mutate("api/table/commands");
      fetchCommand();
      showSuccessToastMessage("La comanda ha sido actualizada correctamente");
    } catch (err) {
      const error = err as AxiosError;
      showErrorMessage({ title: error.response?.data as string });
    } finally {
      setLoading(false);
      formikRef.current?.setSubmitting(false);
    }
  };

  const deleteCommand = () => {
    showForm({
      title: "Eliminar Comanda",
      cancelButtonText: "CANCELAR",
      confirmButtonText: "ELIMINAR",
      customClass: {
        confirmButton: "custom-confirm custom-confirm-create",
      },
      icon: (
        <DeleteForever
          sx={{
            display: "block",
            margin: "auto",
            fontSize: "5rem",
          }}
          color="error"
        />
      ),
      contentHtml: (
        <Typography>
          ¿Estás seguro de eliminar la comanda {`"${id}"`}?
        </Typography>
      ),
      preConfirm: async () => {
        await deleteObject(`api/command/${id}`);
        await mutate("api/table/commands");
        showSuccessToastMessage("La comanda se ha eliminado correctamente");
        router.push(APP_ROUTES.command);
        return;
      },
    });
  };

  const prepareCommand = () => {
    showForm({
      title: "Preparar Comanda",
      cancelButtonText: "CANCELAR",
      confirmButtonText: "PREPARAR",
      customClass: {
        confirmButton: "custom-confirm custom-confirm-create",
      },
      icon: (
        <SetMealIcon
          sx={{
            display: "block",
            margin: "auto",
            fontSize: "5rem",
            color: "#0D6EFD",
          }}
          color="primary"
        />
      ),
      contentHtml: (
        <Typography>
          ¿Estás seguro de preparar la comanda {`"${id}"`}?
        </Typography>
      ),
      preConfirm: async () => {
        await axiosObject.put(`api/command/prepare-command/${id}`);
        mutate("api/table/commands");
        await fetchCommand();
        showSuccessToastMessage("La comanda se ha preparado correctamente");
      },
    });
  };

  return (
    <ContentBox sxProps={{ p: 2 }}>
      <Title>{id === "new" ? "Nueva Comanda" : `Comanda - ${id}`}</Title>

      {isLoadingCommand || isLoadingTable ? (
        <ContentCenter sxProps={{ minHeight: "400px" }}>
          <LoaderComponent />
        </ContentCenter>
      ) : (
        <>
          <CommandAddForm
            user={user!}
            table={table}
            command={command}
            totalOrderPrice={totalOrderPrice}
            customRef={formikRef}
            saveCommand={saveCommand}
          />

          {canManageCommand && (
            <CommandDetailsAddForm
              open={openAddForm}
              closeDialog={closeAddFormDialog}
              setCommandDetailsCollection={setCommandDetailsCollection}
            />
          )}

          {canManageCommand && (
            <CommandDetailsUpdateForm
              open={openUpdateForm}
              closeDialog={closeUpdateFormDialog}
              setCommandDetailsCollection={setCommandDetailsCollection}
              setCommandDetailsSelected={setCommandDetailsSelected}
              commandDetails={commandDetailsSelected}
            />
          )}

          <CommandDetailsInformation
            open={openInformationForm}
            closeDialog={closeInformationFormDialog}
            setCommandDetailsSelected={setCommandDetailsSelected}
            commandDetails={commandDetailsSelected}
          />

          {canGenerateReceipt && (
            <ReceiptSection
              commandId={command?.id}
              open={openReceiptForm}
              close={closeReceiptFormDialog}
              commandDetailsCollection={commandDetailsCollection}
            />
          )}

          <Box sx={{ marginTop: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {canManageCommand && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SaveIcon />}
                  onClick={async () => {
                    setLoading(true);
                    await formikRef.current?.submitForm();

                    if (formikRef && !formikRef.current?.isValid) {
                      setLoading(false);
                      return;
                    }
                  }}
                  disabled={loading}
                >
                  Guardar
                </Button>

                <ButtonAdd
                  openDialog={openAddFormDialog}
                  text="Agregar Plato"
                  disabled={loading}
                />
              </>
            )}

            {id !== "new" && (
              <>
                {command?.commandState.name === "Generado" &&
                  canChangeState && (
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<SetMealIcon />}
                      onClick={() => {
                        if (change) {
                          showWarningMessage({
                            title:
                              "Se ha detectado cambios, debes guardar la comanda antes de prepararla",
                          });
                          return;
                        }

                        prepareCommand();
                      }}
                      disabled={loading}
                    >
                      Servir Plato
                    </Button>
                  )}

                {command?.commandState.name === "Preparado" &&
                  canGenerateReceipt && (
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<PointOfSaleIcon />}
                      onClick={() => {
                        if (change) {
                          showWarningMessage({
                            title:
                              "Se ha detectado cambios, debes guardar la comanda antes de facturarla",
                          });
                          return;
                        }
                        openReceiptFormDialog();
                      }}
                      disabled={loading}
                    >
                      Facturar
                    </Button>
                  )}

                {canManageCommand && (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={deleteCommand}
                    disabled={loading}
                  >
                    Eliminar
                  </Button>
                )}
              </>
            )}

            <Button
              variant="contained"
              startIcon={<ReplyIcon />}
              onClick={async () => {
                if (change) {
                  const result = await showQuestionMessage({
                    title: "¿Estás seguro de salir sin guardar cambios?",
                  });

                  if (result.isDismissed) {
                    return;
                  }

                  setChange(false);
                }

                router.push(APP_ROUTES.command);
              }}
              disabled={loading}
            >
              Volver
            </Button>
          </Box>

          <CommandDetailsTable
            data={commandDetailsCollection}
            setCommandDetailsCollection={setCommandDetailsCollection}
            setCommandDetailsSelected={setCommandDetailsSelected}
            openUpdateFormDialog={openUpdateFormDialog}
            openInformationFormDialog={openInformationFormDialog}
            loading={loading}
          />
        </>
      )}
    </ContentBox>
  );
};

export default CommandDetailsSection;
