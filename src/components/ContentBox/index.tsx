import Box from "@mui/material/Box";
import { SxProps } from "@mui/material/styles";
import { ReactNode } from "react";

interface IContentBoxProps {
  children: ReactNode;
  sxProps?: SxProps;
}

const ContentBox = ({ children, sxProps }: IContentBoxProps) => {
  return (
    <Box
      sx={{
        ...sxProps,
        backgroundColor: "#FFFFFF",
        borderRadius: "4px",
        border: "1px solid rgb(230, 235, 241)",
      }}
    >
      {children}
    </Box>
  );
};

export default ContentBox;
