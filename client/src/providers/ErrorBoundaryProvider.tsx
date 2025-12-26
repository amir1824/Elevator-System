import type { FC } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export interface Provider {
  children: React.ReactNode;
}

export const ErrorBoundaryProvider: FC<Provider> = ({ children }) => {
  return <ErrorBoundary>{children}</ErrorBoundary>;
};