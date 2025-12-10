import { IDishGet } from "@/interfaces";
import { fetchAll } from "@/services";
import { Box, Card, Typography } from "@mui/material";
import useSWR from "swr";

interface CommandDishesCategoryProps {
    setStateCategory: React.Dispatch<React.SetStateAction<string>>;
    selectedCategory: string;
  }

const CommandDishesCategory = (
    {setStateCategory,selectedCategory}: CommandDishesCategoryProps
) => {
  
    const { data: categories, isLoading } = useSWR(
        "api/category",
        () => fetchAll<IDishGet>("api/category")
      ); 
      
      const styleBoxCardCategory = {
        marginRight : 2,
        padding: 1,
        borderRadius: 1.5,
        border : 1,
        borderColor: "primary.main",
        borderStyle: "solid",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "primary.main",
          color: "background.default",
        },
        transition: "0.5s",
      }

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        overflow: "auto",
        padding: 1,
        marginBottom: 1,
      }}
    >

        {
            isLoading ? (
                <Typography>Loading...</Typography>
            ) : (
                 <>
                     <Box
                      key={"C0"} 
                      sx={{
                            ...styleBoxCardCategory,
                            backgroundColor: "todos" === selectedCategory ? "primary.main" : "background.default",
                            color : "todos" === selectedCategory ? "white" : "black",
                      }} 
                      onClick={() => setStateCategory("todos")}
                      >
                        <Typography  variant="body1">Todos</Typography>
                    </Box>
                  {
                      categories?.filter(x => x.id != "C-003").map((category) => (
                        <Box key={category.id} 
                        sx={{
                            ...styleBoxCardCategory,
                            backgroundColor: category.id === selectedCategory ? "primary.main" : "background.default",
                            color : category.id === selectedCategory ? "white" : "black"
                        }} 
                        onClick={() => setStateCategory(category.id)}
                        >
                            <Typography  variant="body1"> {category.name}</Typography>
                        </Box>
                    ))
                  }
                 
                 </>
                
              
            )
        }


    </Box>
  );
};

export default CommandDishesCategory;
