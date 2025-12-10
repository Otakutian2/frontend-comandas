import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { APP_ROUTES } from "@/routes";
import useSWR, { useSWRConfig } from "swr";
import { ITableGet } from "@/interfaces/ITable";

import {
  createObject,
  deleteObject,
  fetchAll,
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
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
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
import useOpenClose from "@/hooks/useOpenClose";
import {
  showErrorMessage,
  showQuestionMessage,
  showSuccessMessage,
  showSuccessToastMessage,
  showWarningMessage,
} from "@/lib/Messages";
import CommandDetailsUpdateForm from "@/features/Command/CommandDetailsUpdateForm";
import { FormikProps } from "formik";
import { AxiosError } from "axios";
import { showForm } from "@/lib/Forms";
import DeleteForever from "@mui/icons-material/DeleteForever";
import SetMealIcon from "@mui/icons-material/SetMeal";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"; // Usaremos flecha arriba para indicar el scroll hacia el form
import Typography from "@mui/material/Typography";
import axiosObject from "@/services/Axios";
import ReceiptSection from "../ReceiptSection";
import UserRoles from "@/interfaces/UserRoles";
import {
  Divider,
  Fab,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CommandDishesCategory from "@/features/Command/CommandDishesCategory";
import { IDishGet } from "@/interfaces";
import CommandCard from "@/features/Command/CommandCard";
import CounterCommand from "@/features/Command/CounterCommand";

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
  const [selecteCategory, setSelecteCategory] = useState<string>("todos");
  const [dishCollection, setDishCollection] = useState<IDishGet[]>([]);
  const [loadingDishCollection, setLoadingDishCollection] =
    useState<boolean>(false);
   const formRef = useRef<HTMLDivElement>(null); 
  const [openUpdateForm, openUpdateFormDialog, closeUpdateFormDialog] =
    useOpenClose(false);
 

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showFab, setShowFab] = useState(true);
  const scrollToForm = () => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

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
  // const canChangeState = role === "Administrador" || role === "Cocinero";
  const condicionalBotonTicket =
    command?.commandState.name === "Generado" ||
    command?.commandState.name === "Preparado";

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
    if (
      commandDetailsCollection.length === 0 &&
      initialCommandDetailsCollection.length === 0
    ) {
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

    // const changeInCommandDetailsCollection =
    //   initialCommandDetailsCollection.findIndex((item) => {
    //     const commandDetails = commandDetailsCollection.find(
    //       (commandDetailsCollection) =>
    //         commandDetailsCollection.dish.id === item.dish.id
    //     );

    //     return (
    //       commandDetails?.dishQuantity !== item.dishQuantity ||
    //       commandDetails?.observation != item.observation
    //     );
    //   });

    // if (changeInCommandDetailsCollection !== -1) {
    //   setChange(true);
    //   console.log("Hubo cambios en los detalles");
    //   return;
    // }

    setChange(false);
    console.log("No hubo cambios");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandDetailsCollection]);

  // Dectetando cambios en selecteCategory

  useEffect(() => {
    fetchDishCollection();
  }, [selecteCategory]);

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

useEffect(() => {
  if (!formRef.current || !isMobile) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
          setShowFab(false);
      } else {
          setShowFab(true);
      }
    },
    { threshold: 0.1 } 
  );

  observer.observe(formRef.current);

  return () => {
    observer.disconnect();
  };
}, [isMobile]);

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
          extras: commandDetails.extras ?? [],
          uniqueId: commandDetails.uniqueId,
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
      customerAnonymous: formikRef.current?.values.customerAnonymous,
      discountType: formikRef.current?.values.discountType,
      discount: formikRef.current?.values.discount,
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
      customerAnonymous: formikRef.current?.values.customerAnonymous ?? null,
      discountType: formikRef.current?.values.discountType,
      discount: formikRef.current?.values.discount,
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

  // const prepareCommand = () => {
  //   showForm({
  //     title: "Preparar Comanda",
  //     cancelButtonText: "CANCELAR",
  //     confirmButtonText: "PREPARAR",
  //     customClass: {
  //       confirmButton: "custom-confirm custom-confirm-create",
  //     },
  //     icon: (
  //       <SetMealIcon
  //         sx={{
  //           display: "block",
  //           margin: "auto",
  //           fontSize: "5rem",
  //           color: "#0D6EFD",
  //         }}
  //         color="primary"
  //       />
  //     ),
  //     contentHtml: (
  //       <Typography>
  //         ¿Estás seguro de preparar la comanda {`"${id}"`}?
  //       </Typography>
  //     ),
  //     preConfirm: async () => {
  //       await axiosObject.put(`api/command/prepare-command/${id}`);
  //       mutate("api/table/commands");
  //       await fetchCommand();
  //       showSuccessToastMessage("La comanda se ha preparado correctamente");
  //     },
  //   });
  // };

  const generateTicket = async (showPrice = true) => {
    try {
      setLoading(true);
      const result = await createObject<any, any>(`api/ThermalPrinter`, {
        commandId: id,
        showPrice: showPrice,
      } as any);

      const pdfbyte = result.archivo.fileContents;
      console.log(pdfbyte);

      const byteCharacters = Buffer.from(pdfbyte, "base64");
      const byteNumbers = new Uint8Array(byteCharacters);
      const blob = new Blob([byteNumbers], { type: "application/pdf" });

      const pdfUrl = window.URL.createObjectURL(blob);

      // Abrir el PDF en una nueva ventana
      const printWindow = window.open(pdfUrl);

      // Esperar a que el PDF se cargue y luego imprimirlo
      printWindow!.onload = function () {
        printWindow!.print();
      };

      showSuccessMessage(result.message);
    } catch (err) {
      const error = err as AxiosError;
      showErrorMessage({ title: error.response?.data as string });
    } finally {
      setLoading(false);
    }
  };

  const fetchDishCollection = async () => {
    try {
      setLoadingDishCollection(true);
      const dishCollection = await fetchAll<IDishGet>(
        `api/dish/by-category/${selecteCategory}`
      );
      setDishCollection(dishCollection.filter((dish) => dish.active == true));
    } catch (err) {
      console.log(err); 
    } finally {
      setLoadingDishCollection(false);
    }
  };

  // const estaEnLaLista = (id: string) => {
  //   const index = commandDetailsCollection.findIndex(
  //     (item) => item.dish.id === id
  //   );

  //   return index !== -1;
  // };

  return (
    <ContentBox sxProps={{ p: 2 }}>
      <Title>{id === "new" ? "Nueva Comanda" : `Comanda - ${id}`}</Title>

      {isLoadingCommand || isLoadingTable ? (
        <ContentCenter sxProps={{ minHeight: "400px" }}>
          <LoaderComponent />
        </ContentCenter>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <CommandDishesCategory
                selectedCategory={selecteCategory}
                setStateCategory={setSelecteCategory}
              />
              <Divider />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: "100%",
                  marginTop: 1,
                  gap: 1,
                  marginBottom: 1,
                  backgroundColor: "#faf0e6",
                  padding: 1,
                  borderRadius: 3,
                }}
              >
                {loadingDishCollection ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "100px",
                    }}
                  >
                    <Typography>Loading...</Typography>
                  </Box>
                ) : (
                  <>
                    {dishCollection.map((dish) => (
                      <CommandCard
                        key={dish.id}
                        dish={dish}
                        setListDishes={setCommandDetailsCollection}
                        disabled={false}
                      />
                    ))}
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={5} >
              <CommandAddForm
                user={user!}
                table={table}
                // isTabledIdExist={tableId !== undefined && tableId !== 0}
                command={command}
                // totalOrderPrice={totalOrderPrice}
                customRef={formikRef}
                commandDetailsCollection={commandDetailsCollection}
                saveCommand={saveCommand}
              />
              <Box
              ref={formRef}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  marginY: 2,
                  maxHeight: "500px",
                  overflowY: "auto",
                }}
              >
                <Typography
                 variant="h6"
                >
                 Plato(s) en la comanda {commandDetailsCollection.length} 
                </Typography>

                {commandDetailsCollection.map((commandDetails) => (
                  <CounterCommand
                    key={commandDetails.uniqueId}
                    commandDetail={commandDetails}
                    openUpdateFormDialog={openUpdateFormDialog}
                    setCommandDetailsSelected={setCommandDetailsSelected}
                    setCurrentCommandDetail={setCommandDetailsCollection}
                  />
                ))}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 2,
                  gap: 2,
                }}
              >
   
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
                  </>
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

                {condicionalBotonTicket && (
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<ConfirmationNumberIcon />}
                    onClick={() => {
                      if (change) {
                        showWarningMessage({
                          title:
                            "Se ha detectado cambios, debes guardar la comanda antes de generarTicket",
                        });
                        return;
                      }
                      generateTicket(false);
                    }}
                    disabled={loading}
                  >
                    Generar Ticket Para Cocina
                  </Button>
                )}

                {condicionalBotonTicket && (
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<ConfirmationNumberIcon />}
                    onClick={() => {
                      if (change) {
                        showWarningMessage({
                          title:
                            "Se ha detectado cambios, debes guardar la comanda antes de generarTicket",
                        });
                        return;
                      }
                      generateTicket();
                    }}
                    disabled={loading}
                  >
                    Generar Ticket
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
            </Grid>
          </Grid>
        {isMobile && showFab && (
          <Box
            sx={{
              position: "fixed",
              bottom: 16, // Espacio desde el fondo
              right: 16, // Espacio desde la derecha
              zIndex: 1000, // Asegura que esté por encima de otros elementos
            }}
          >
            <Fab
              color="primary"
              aria-label="ir al formulario"
              onClick={scrollToForm}
            >
              <KeyboardArrowDownIcon />
            </Fab>
          </Box>
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
          {canGenerateReceipt && (
            <ReceiptSection
              commandId={command?.id}
              open={openReceiptForm}
              close={closeReceiptFormDialog}
              commandDetailsCollection={commandDetailsCollection}
              discount={formikRef.current?.values?.discount || 0}
              discountType={formikRef.current?.values?.discountType || "none"}
            />
          )}

        </>
      )}
    </ContentBox>
  );
};

export default CommandDetailsSection;
