"use client";
import Form from "@/components/form/Form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Home() {
  const queryClient = new QueryClient();

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Form />
      </QueryClientProvider>
    </div>
  );
}
