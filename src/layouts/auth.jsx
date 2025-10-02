import Loader from "@/components/LoadingFalback";
import { isUserLoggedIn } from "@/lib/auth";
import { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function AuthLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (isUserLoggedIn()) {
      navigate("/");
    }
  }, [navigate, location.pathname]);
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </>
  );
}
