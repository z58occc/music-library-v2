import { RouterProvider } from "react-router";
import {router} from "./router";
import "bootstrap-icons/font/bootstrap-icons.json";

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
