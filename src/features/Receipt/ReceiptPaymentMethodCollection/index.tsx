import { IReceiptInfo } from "@/interfaces/IReceipt";
import { findImage } from "@/sections/ReceiptSection";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import PaymentMethodCard from "@/components/PaymentMethodCard";
import { IPaymentMethodGet } from "@/interfaces/IPaymentMethod";

interface ReceiptPaymentMethodCollectionProps {
  receiptDetails: IReceiptInfo;
  setReceiptDetails: React.Dispatch<React.SetStateAction<IReceiptInfo>>;
  paymentMethodCollection?: IPaymentMethodGet[];
}

const ReceiptPaymentMethodCollection: React.FC<
  ReceiptPaymentMethodCollectionProps
> = ({ receiptDetails, setReceiptDetails, paymentMethodCollection }) => {
  const theme = useTheme();

  if (!receiptDetails.receiptDetailsCollection) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexDirection: "column",
        backgroundColor: theme.palette.grey[100],
        maxHeight: "250px",
        overflowY: "auto",
      }}
    >
      {receiptDetails.receiptDetailsCollection.map((item) => {
        const paymentMethod = paymentMethodCollection?.find(
          (paymentMethod) => paymentMethod.id === item.paymentMethodId
        )!;

        return (
          <PaymentMethodCard
            key={item.paymentMethodId}
            imageUrl={findImage(paymentMethod.name)}
            amount={item.amount}
            deletePaymentMethod={() => {
              setReceiptDetails((prev) => {
                const collection =
                  prev.receiptDetailsCollection?.filter(
                    (receiptDetails) =>
                      receiptDetails.paymentMethodId !== item.paymentMethodId
                  ) || null;

                return { ...prev, receiptDetailsCollection: collection };
              });
            }}
            name={paymentMethod.name}
          />
        );
      })}
    </Box>
  );
};

export default ReceiptPaymentMethodCollection;
