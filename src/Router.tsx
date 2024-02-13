import { RouteObject } from 'react-router-dom';
import Layout from './Layout';
import CreateCountForm from './Pages/Manager/CreateCountForm';
import ViewCounts from './Pages/Manager/ViewCounts';
import CountProducts from './Pages/Count/CountProducts';
import ShowCounted from './Pages/Count/ShowCounted';
import NotFoundPage from './Pages/NotFoundPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CreateCountForm />
      },
      {
        path: 'view-counts',
        element: <ViewCounts />
      },
      {
        path: 'count/:countID/addProduct',
        element: <CountProducts />
      },
      {
        path: 'count/:countID/show-counted',
        element: <ShowCounted />
      },
      // 404 Sayfası için catch-all route
      {
        path: '*',
        element: <NotFoundPage />
      },
    ],
  },
];

export default routes;
