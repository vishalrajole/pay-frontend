import { PaymentStatus } from "@/api/makeData";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { capitalizedStatus } from "@/helpers/capitalize";

export function Status({ status }: { status: PaymentStatus }) {
  const statusStyles = {
    failed: "bg-red-500 text-white",
    processing: "bg-orange-500 text-white",
    completed: "bg-green-500 text-white",
  };

  const statusText = {
    failed: "Payment failed",
    processing: "Payment is being processed",
    completed: "Payment completed",
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            className={`px-2 py-1 rounded-md hover:${statusStyles[status]} ${statusStyles[status]}`}
          >
            {capitalizedStatus(status)}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>{statusText[status]}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
