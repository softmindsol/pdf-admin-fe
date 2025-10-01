import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Suspense } from "react";
import Loader from "./components/LoadingFalback";

export default function App() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}
