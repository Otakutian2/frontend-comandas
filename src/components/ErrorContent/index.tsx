import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import LinkNext from "next/link";
import Image from "next/image";
import IErrorProps from "@/interfaces/IErrorProps";

const ErrorContent = ({
  title,
  code,
  description,
  image,
  home,
}: IErrorProps) => {
  return (
    <Box
      sx={{
        maxWidth: 850,
        margin: "auto 2rem",
      }}
    >
      <Typography align="center" variant="h3" gutterBottom={true}>
        Error {code} - {title}
      </Typography>
      <Typography align="center" variant="h6" paragraph={true}>
        {description}
      </Typography>
      <Image
        src={image}
        alt={`Error ${code}`}
        style={{
          width: "100%",
          height: "clamp(200px, 20vw + 240px, 500px)",
          objectFit: "contain",
        }}
        priority={true}
      />
      <Link
        href={home}
        fontSize={20}
        alignItems={"center"}
        component={LinkNext}
      >
        ⏪ Ir al inicio
      </Link>
    </Box>
  );
};

export default ErrorContent;
