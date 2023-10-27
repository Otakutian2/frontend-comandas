import ContentBox from "@/components/ContentBox";
import DishTable from "@/features/Dish/DishTable";
import ButtonAdd from "@/components/ButtonAdd";
import DishAddForm from "@/features/Dish/DishAddForm";
import Box from "@mui/material/Box";
import Fastfood from "@mui/icons-material/Fastfood";
import useSWR from "swr";
import LoaderComponent from "@/components/LoaderComponent";
import { IDishCreateOrUpdate, IDishGet } from "@/interfaces/IDish";
import { FormikProps } from "formik/dist/types";
import { showForm } from "@/lib/Forms";
import { fetchAll } from "@/services/HttpRequests";
import { ICategoryGet } from "@/interfaces/ICategory";
import Title from "@/components/Title";
import { useRef } from "react";

const DishSection = () => {
  const formikRef = useRef<FormikProps<IDishCreateOrUpdate>>(null);
  const { data: dishes, isLoading: isLoadingDishes } = useSWR("api/dish", () =>
    fetchAll<IDishGet>("api/dish")
  );

  const { data: categories, isLoading: isLoadingCategories } = useSWR(
    "api/category",
    () => fetchAll<ICategoryGet>("api/category")
  );

  if (isLoadingDishes || isLoadingCategories) return <LoaderComponent />;

  return (
    <ContentBox>
      <Box sx={{ marginTop: 2, marginX: 2 }}>
        <Title variant="h2">Platos</Title>

        <ButtonAdd
          text="Añadir Plato"
          openDialog={() => {
            showForm({
              title: "Añadir Plato",
              cancelButtonText: "CANCELAR",
              confirmButtonText: "AÑADIR",
              customClass: {
                confirmButton: "custom-confirm custom-confirm-create",
              },
              icon: (
                <Fastfood
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
                <DishAddForm data={categories!} customRef={formikRef} />
              ),
              preConfirm: async () => {
                await formikRef.current?.submitForm();
                if (formikRef && !formikRef.current?.isValid) {
                  return false;
                }
              },
            });
          }}
        />
      </Box>

      <DishTable data={dishes!} categories={categories!} />
    </ContentBox>
  );
};

export default DishSection;
