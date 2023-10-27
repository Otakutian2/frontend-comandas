import Box from "@mui/material/Box";
import { SxProps } from "@mui/material/styles";
import { ReactNode } from "react";

interface IContentCenterProps {
  children: ReactNode;
  sxProps?: SxProps;
}

const ContentCenter = ({ children, sxProps }: IContentCenterProps) => {
  return (
    <Box
      sx={{
        ...sxProps,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </Box>
  );
};

export default ContentCenter;
