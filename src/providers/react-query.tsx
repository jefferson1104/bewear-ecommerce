"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface IReactQueryProviderProps {
  children: React.ReactNode;
}

export const ReactQueryProvider = ({ children }: IReactQueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
