export type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
};

export type NotificationResponse = {
  data: Notification[];
  meta: {
    totalRowCount: number;
  };
};
