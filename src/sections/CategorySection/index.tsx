import ContentBox from "@/components/ContentBox";
import CategoryAddForm from "@/features/Category/CategoryAddForm";
import CategoryTable from "@/features/Category/CategoryTable";
import ButtonAdd from "@/components/ButtonAdd";
import Box from "@mui/material/Box";
import FoodBank from "@mui/icons-material/FoodBank";
import useSWR from "swr";
import { ICategoryGet, ICategoryPrincipal } from "@/interfaces/ICategory";
import { FormikProps } from "formik/dist/types";
import { showForm } from "@/lib/Forms";
import { fetchAll } from "@/services/HttpRequests";
import LoaderComponent from "@/components/LoaderComponent";
import Title from "@/components/Title";
import { useRef } from "react";

const CategorySection = () => {
  const formikRef = useRef<FormikProps<ICategoryPrincipal>>(null);
  const { data, isLoading } = useSWR("api/category", () =>
    fetchAll<ICategoryGet>("api/category")
  );

  if (isLoading) return <LoaderComponent />;

  return (
    <ContentBox>
      <Box sx={{ marginTop: 2, marginX: 2 }}>
        <Title variant="h2">Categorías de Platos</Title>

        <ButtonAdd
          text="Añadir Categoría de Plato"
          openDialog={() => {
            showForm({
              title: "Añadir Categoria de Plato",
              cancelButtonText: "CANCELAR",
              confirmButtonText: "AÑADIR",
              customClass: {
                confirmButton: "custom-confirm custom-confirm-create",
              },
              icon: (
                <FoodBank
                  sx={{
                    display: "block",
                    margin: "auto",
                    fontSize: "5rem",
                    color: "#0D6EFD",
                  }}
                  color="primary"
                />
              ),
              contentHtml: <CategoryAddForm customRef={formikRef} />,
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

      <CategoryTable data={data!} />
    </ContentBox>
  );
};

export default CategorySection;
