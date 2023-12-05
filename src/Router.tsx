// src/Router.tsx
import { Navigate, RouteObject } from 'react-router-dom';
import Layout from './Layout';
import CreateCountForm from './Pages/Manager/CreateCountForm';
import ViewCounts from './Pages/Manager/ViewCounts';
import CountProducts from './Pages/Count/CountProducts';
import ShowCounted from './Pages/Count/ShowCounted';

const routes: RouteObject[] = [
  {
    path: '/stock-count-ts-app', element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate replace to="/count/products"  />
      },
      {
        path: 'manager',children: [      // Routings for managers
          { path: 'create-counts',element: <CreateCountForm />},
          { path: 'view-counts',element: <ViewCounts />},
        ]
      },
      {
        path: 'count',children: [// Routing for protuct counting
          { path: 'products',element: <CountProducts />},
          { path: 'show-counted',element: <ShowCounted />},]
      },
    ],
  },
];

export default routes;
