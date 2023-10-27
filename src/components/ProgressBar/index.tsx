import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const ProgressBar = () => {
  return (
    <Box
      sx={{ top: 0, left: 0, width: "100%", zIndex: 1500, position: "fixed" }}
    >
      <LinearProgress sx={{ height: "3px" }} />
    </Box>
  );
};

export default ProgressBar;
