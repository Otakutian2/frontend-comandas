import ContentCenter from "../ContentCenter";
import CircularProgress from "@mui/material/CircularProgress";

interface LoaderComponentProps {
  size?: number | string;
}

const LoaderComponent: React.FC<LoaderComponentProps> = ({ size }) => {
  return (
    <ContentCenter sxProps={{ flexGrow: 1 }}>
      <CircularProgress color="primary" size={size} />
    </ContentCenter>
  );
};

export default LoaderComponent;
