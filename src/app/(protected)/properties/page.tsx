import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PropertyList from "./PropertyList";

export default async function Properties() {
  const queryClient = new QueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="grid items-center justify-items-center">
      Properties
      <HydrationBoundary state={dehydratedState}>
        <PropertyList />
      </HydrationBoundary>
    </div>
  );
}
