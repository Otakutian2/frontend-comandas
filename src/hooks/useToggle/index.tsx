import { useState, useCallback } from "react";

const useToggle = (initialState: boolean): [boolean, () => void] => {
  const [state, setState] = useState<boolean>(initialState);

  const toggle = useCallback(() => {
    setState((prev) => !prev);
  }, []);

  return [state, toggle];
};

export default useToggle;
