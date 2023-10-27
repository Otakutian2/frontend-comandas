import Colors from "@/interfaces/Colors";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

interface ISeverityPillProps {
  children?: ReactNode;
  color?: Colors;
}

interface ISeverityPillRootProps {
  ownerState: {
    color: Colors;
  };
}

const SeverityPillRoot = styled("span", {
  shouldForwardProp: (prop) => prop !== "ownerState",
})<ISeverityPillRootProps>(({ theme, ownerState }) => {
  const color = theme.palette[ownerState.color!].dark;

  return {
    color: color,
    fontWeight: "700",
    fontSize: "0.75rem",
  };
});

const SeverityPill = ({
  color = "primary",
  children,
  ...other
}: ISeverityPillProps) => {
  const ownerState = { color };

  return (
    <SeverityPillRoot ownerState={ownerState} {...other}>
      {children}
    </SeverityPillRoot>
  );
};

export default SeverityPill;
