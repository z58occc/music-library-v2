import { createHashRouter, ScrollRestoration } from "react-router";
import DashBoard from "./pages/DashBoard";
import Layout from "./pages/Layout";
import ChartPage from "./pages/ChartPage";

export const router = createHashRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollRestoration />
        <Layout />
      </>
    ),
    children: [
      {
        path: "/",
        element: <DashBoard />,
      },
      {
        path: "chart",
        element: <ChartPage />,
      },
    ],
  },
]);
