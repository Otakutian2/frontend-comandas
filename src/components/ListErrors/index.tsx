import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import IErrorMessages from "@/interfaces/IErrorMessages";

interface IListErrorsProps {
  errorMessages: IErrorMessages;
}

const ListErrors = ({ errorMessages }: IListErrorsProps) => {
  return (
    <List>
      {Object.keys(errorMessages).map((key) => (
        <ListItem
          sx={{ flexDirection: "column", alignItems: "flex-start" }}
          key={key}
        >
          <Typography>{key}</Typography>
          {errorMessages[key].map((message) => (
            <ListItemText key={message} secondary={"- " + message} />
          ))}
        </ListItem>
      ))}
    </List>
  );
};

export default ListErrors;
