import ContentBox from "@/components/ContentBox";
import EstablishmentUpdateForm from "@/features/Establishment/EstablishmentUpdateForm";
import useSWR from "swr";
import LoaderComponent from "@/components/LoaderComponent";
import { IEstablishmentGet } from "@/interfaces/IEstablishment";
import { getObject } from "@/services/HttpRequests";
import Title from "@/components/Title";

const EstablishmentSection = () => {
  const { data, isLoading } = useSWR("api/establishment/first", () =>
    getObject<IEstablishmentGet>("api/establishment/first")
  );

  if (isLoading) return <LoaderComponent />;

  return (
    <ContentBox
      sxProps={{
        padding: 2,
      }}
    >
      <Title variant="h2">Establecimiento</Title>

      <EstablishmentUpdateForm establishment={data!} />
    </ContentBox>
  );
};

export default EstablishmentSection;
