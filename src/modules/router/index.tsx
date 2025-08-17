import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
import BaseLayout from '@/pages/base';

const Home = lazy(() => import('@/pages/home'));
const PricePlans = lazy(() => import('@/pages/price-plans'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <BaseLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/price-plans',
        element: <PricePlans />,
      },
    ],
  },
]);
