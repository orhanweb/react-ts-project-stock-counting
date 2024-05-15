import { RouteObject } from "react-router-dom";
import Layout from "./Layout";
import CreateCount from "./Pages/CreateCount";
import ViewCounts from "./Pages/ViewCounts";
import AddProduct from "./Pages/Count/AddProduct";
import ViewCounted from "./Pages/Count/ViewCounted";
import NotFoundPage from "./Pages/NotFoundPage";
import LabPage from "./Pages/Lab";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CreateCount />,
      },
      {
        path: "view-counts",
        element: <ViewCounts />,
      },
      {
        path: "count/:countID/addProduct",
        element: <AddProduct />,
      },
      {
        path: "count/:countID/view-counted",
        element: <ViewCounted />,
      },
      {
        path: "count/:countID/lab",
        element: <LabPage />,
      },
      // catch-all route for 404 page
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];

export default routes;
