import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddAPhoto from "@mui/icons-material/AddAPhoto";
import Image from "next/image";
import ContentCenter from "@/components/ContentCenter";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface IImageDropzoneProps {
  onDrop: (file: File) => void;
  isSubmitting: boolean;
  imageDish?: string;
}

const ImageDropzone = ({
  onDrop,
  isSubmitting,
  imageDish,
}: IImageDropzoneProps) => {
  const [image, setImage] = useState<string | null>(imageDish || null);

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      Swal.showValidationMessage(
        "Por favor seleccione una imagen con un peso menor a 1MB"
      );

      return;
    }

    const url = URL.createObjectURL(acceptedFiles[0]);
    setImage(url);
    onDrop(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 1048576,
    onDrop: handleDrop,
  });

  useEffect(() => {
    return () => URL.revokeObjectURL(image!);
  }, [image]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 180,
        height: 180,
        border: "1px dashed rgba(0, 0, 0, 0.12)",
        margin: "auto",
        backgroundColor: "#f4f6f8",
        cursor: isSubmitting ? "normal" : "pointer",
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} disabled={isSubmitting} />
      {image ? (
        <Image
          src={image}
          alt={`Dish Image`}
          width={800}
          height={600}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          onLoad={() => {
            URL.revokeObjectURL(image);
          }}
        />
      ) : (
        <ContentCenter sxProps={{ flexDirection: "column", color: "#919eab" }}>
          <AddAPhoto />
          <Typography>Carga una imagen</Typography>
        </ContentCenter>
      )}
    </Box>
  );
};

export default ImageDropzone;
