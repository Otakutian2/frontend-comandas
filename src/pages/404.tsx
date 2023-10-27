import ContentCenter from "@/components/ContentCenter";
import ErrorContent from "@/components/ErrorContent";
import Route, { useRouter } from "next/router";
import image404 from "public/404.png";
import IErrorProps from "@/interfaces/IErrorProps";
import { APP_ROUTES } from "@/routes";
import { useUserStore } from "@/store/user";

const Custom404 = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  if (!user) {
    return null;
  }

  const error404: IErrorProps = {
    title: `Página no encontrada`,
    code: 404,
    description:
      router.asPath !== APP_ROUTES.error404
        ? `La ruta '${Route.asPath}' no existe`
        : "",
    image: image404,
    home: "/",
  };

  return (
    <ContentCenter sxProps={{ minHeight: "100svh" }}>
      <ErrorContent {...error404}></ErrorContent>
    </ContentCenter>
  );
};

export default Custom404;
