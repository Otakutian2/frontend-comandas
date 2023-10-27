import { StaticImageData } from "next/image";

interface IErrorProps {
  title: string;
  code: number;
  description: string;
  image: StaticImageData;
  home: string;
}

export default IErrorProps;
