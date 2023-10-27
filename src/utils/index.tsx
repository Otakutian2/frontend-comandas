import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { MutableRefObject } from "react";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { createTheme } from "@mui/material";
import { esES } from "@mui/material/locale";
import { esES as dataGridEsES } from "@mui/x-data-grid";
import { esES as datePickersEsES } from "@mui/x-date-pickers";

const handleLastPageDeletion = (
  gridApiRef: MutableRefObject<GridApiCommunity>,
  size: number
) => {
  const pageSize = gridApiRef.current.state.pagination.paginationModel.pageSize;
  const currentPage = gridApiRef.current.state.pagination.paginationModel.page;
  const lastPage = Math.ceil(size / pageSize) - 1;

  if (currentPage === lastPage && (size % pageSize === 1 || pageSize === 1)) {
    gridApiRef.current.setPage(currentPage - 1);
  }
};

const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "ocg0xuaa");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dpfhjk0sw/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const result: any = await response.json();

    return result.url;
  } catch (error) {
    console.log(error);
  }
};

let theme = createTheme({
  palette: {
    background: {
      default: "rgb(250, 250, 251)",
    },
    primary: {
      dark: "#063FB6",
      main: "#0D6EFD",
      light: "#6DB4FE",
      contrastText: "#FFFFFF",
    },
  },
});

theme = createTheme(
  theme,
  {
    components: {
      MuiCssBaseline: {
        styleOverrides: () => ({
          "&::-webkit-scrollbar": {
            width: "7px",
            height: "7px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "5px",
            "&:hover": {
              backgroundColor: "#555",
            },
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
        }),
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "rgba(0, 0, 0, 0.23)",
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: theme.palette.primary.main,
            },
          },
        },
      },
      MuiDialog: {
        defaultProps: {
          PaperProps: {
            sx: {
              boxShadow: "none",
            },
          },
          slotProps: {
            backdrop: {
              sx: {
                backgroundColor: "rgba(0, 0, 0, 0.4)",
              },
            },
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            paddingBottom: "16px",
            overflowY: "visible",
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            paddingLeft: "24px",
            paddingRight: "24px",

            paddingBottom: "16px",
            paddingTop: "0",
          },
        },
      },
    },
  },
  esES,
  datePickersEsES,
  dataGridEsES
);

const validateEntries = (
  e: React.KeyboardEvent<HTMLInputElement>,
  exp: RegExp
) => {
  const { key, ctrlKey } = e;
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];
  const isNumber = exp.test(key);
  const isShortcutCut = ctrlKey && key.toLowerCase() === "x";
  const isValidKey = isNumber || allowedKeys.includes(key) || isShortcutCut;

  if (!isValidKey) {
    e.preventDefault();
  }
};

const onlyNumber = (e: React.KeyboardEvent<HTMLInputElement>) =>
  validateEntries(e, /^\d$/);

const onlyDecimal = (e: React.KeyboardEvent<HTMLInputElement>) =>
  validateEntries(e, /^[^Ee+-]+$/);

const removeAccents = (text: string) => {
  const replacements = {
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ú: "u",
    ü: "u",
    Á: "A",
    É: "E",
    Í: "I",
    Ó: "O",
    Ú: "U",
    Ü: "U",
  };

  const regex = /[áéíóúüÁÉÍÓÚÜ]/g;
  return text.replace(
    regex,
    (letterWithAccent) =>
      replacements[letterWithAccent as keyof typeof replacements]
  );
};

const roundDecimal = (decimal: number) => {
  return Math.round(decimal * 100) / 100;
};

const colorsForChart = [
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(54, 162, 235)",
  "rgb(153, 102, 255)",
  "rgb(201, 203, 207)",
];

const colorsWithAlphaForChart = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(255, 159, 64, 0.2)",
  "rgba(255, 205, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(201, 203, 207, 0.2)",
];

const ramdonKey = (name: string) => {
  return Math.random()
    .toString(36)
    .replace("0.", name || "");
};

export {
  handleLastPageDeletion,
  uploadToCloudinary,
  theme,
  removeAccents,
  onlyNumber,
  onlyDecimal,
  roundDecimal,
  colorsForChart,
  colorsWithAlphaForChart,
  ramdonKey,
};
