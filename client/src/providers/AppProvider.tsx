import type { FC } from 'react';
import type { Provider } from '@/providers/ErrorBoundaryProvider';
import { ErrorBoundaryProvider } from '@/providers/ErrorBoundaryProvider';

export type ProviderComponent = FC<Provider>;

const providers: ProviderComponent[] = [ErrorBoundaryProvider];

export const AppProvider: FC<Provider> = ({ children }) => {
  const app = providers.reduceRight(
    (nestedApp, CurrentProvider) => (
      <CurrentProvider>{nestedApp}</CurrentProvider>
    ),
    children
  );

  return <>{app}</>;
};