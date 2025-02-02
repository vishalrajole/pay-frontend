export type PaymentStatus = "completed" | "failed" | "processing";

export type Payment = {
  id: string;
  firstName: string;
  lastName: string;
  reference: string;
  amount: string;
  status: PaymentStatus;
  createdAt: Date;
};

export type PaymentResponse = {
  data: Payment[];
  meta: {
    totalRowCount: number;
  };
};
