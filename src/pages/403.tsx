import ContentCenter from "@/components/ContentCenter";
import ErrorContent from "@/components/ErrorContent";
import image403 from "public/403.png";
import IErrorProps from "@/interfaces/IErrorProps";

const Custom403 = () => {
  const error403: IErrorProps = {
    title: `Página prohibida`,
    code: 403,
    description: `No tienes los permisos necesarios para visualizar esta página`,
    image: image403,
    home: "/",
  };

  return (
    <ContentCenter sxProps={{ minHeight: "100svh" }}>
      <ErrorContent {...error403}></ErrorContent>
    </ContentCenter>
  );
};

export default Custom403;
