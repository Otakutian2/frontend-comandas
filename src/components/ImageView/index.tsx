import React from "react";
import ContentCenter from "../ContentCenter";
import Image from "next/image";
import InsertPhotoOutlined from "@mui/icons-material/InsertPhotoOutlined";

interface ImageViewProps {
  width?: number | string;
  height?: number | string;
  image?: string;
}

const ImageView: React.FC<ImageViewProps> = ({
  width = "100px",
  height = "100px",
  image,
}) => {
  return (
    <ContentCenter
      sxProps={{
        width: { width },
        height: { height },
        position: "relative",
        backgroundColor: "rgb(248, 249, 250)",
      }}
    >
      {image ? (
        <Image
          src={image}
          alt="Image"
          fill
          priority={true}
          style={{
            objectFit: "contain",
          }}
        />
      ) : (
        <InsertPhotoOutlined fontSize="large" />
      )}
    </ContentCenter>
  );
};

export default ImageView;
