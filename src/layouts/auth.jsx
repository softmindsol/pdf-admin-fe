import Loader from "@/components/LoadingFalback";
import { isUserLoggedIn } from "@/lib/auth";
import { Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";


export default function AuthLayout() {
  const navigate =useNavigate()  
  // useEffect(() => {
  //   if (isUserLoggedIn()) {
  //     navigate("/dashboard");
  //   }
  // }, [navigate]);
  return (
    <>
    <Suspense fallback={<Loader/>}>
    <Outlet/>
    </Suspense>
    </>
  );
}