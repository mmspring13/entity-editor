import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
import BaseLayout from '@/pages/base';

const PricePlans = lazy(() => import('@/pages/price-plans'));
const Pages = lazy(() => import('@/pages/pages'));
const Products = lazy(() => import('@/pages/products'));

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
        path: '/price-plans',
        element: <PricePlans />,
      },
      {
        path: '/pages',
        element: <Pages />,
      },
      {
        path: '/products',
        element: <Products />,
      },
    ],
  },
]);
