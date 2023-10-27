import { styled } from "@mui/material";
import Popper from "@mui/material/Popper";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { useEffect, useState } from "react";
import LoaderComponent from "../LoaderComponent";

interface IComboBoxProps<T> {
  value?: T | null;
  values: T[];
  id: keyof T;
  label: keyof T;
  textFieldProps: TextFieldProps;
  loading?: boolean;
  disabled?: boolean;
  disableClearable?: boolean;
  size?: "medium" | "small";
  handleChange: (value: T | null) => void;
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: T
  ) => JSX.Element;
}

const StyledPopper = styled(Popper)({
  "&": {
    zIndex: 1510,
  },
});

const ComboBox = <T,>({
  value,
  values,
  id,
  label,
  textFieldProps,
  disabled,
  disableClearable,
  size,
  loading,
  handleChange,
  renderOption,
}: IComboBoxProps<T>) => {
  const [valueState, setValueState] = useState<T | null>(value ?? null);

  useEffect(() => {
    setValueState(value ?? null);
  }, [value]);

  return (
    <Autocomplete
      sx={{
        "& .MuiAutocomplete-popper": {
          backgroundColor: "red",
        },
      }}
      PopperComponent={StyledPopper}
      value={valueState}
      isOptionEqualToValue={(option: T, value: T) =>
        value && option[id] === value[id]
      }
      options={values || []}
      onChange={(_event: any, newValue: T | null) => {
        handleChange(newValue);
        setValueState(newValue);
      }}
      size={size}
      loading={loading}
      disabled={disabled}
      disableClearable={disableClearable}
      getOptionLabel={(options: T) => `${options[label]}`}
      renderOption={renderOption}
      renderInput={(params) => (
        <TextField
          {...params}
          {...textFieldProps}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <Box>
                    <LoaderComponent size={20} />
                  </Box>
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default ComboBox;
