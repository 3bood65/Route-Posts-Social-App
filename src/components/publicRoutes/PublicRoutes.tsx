import { Navigate } from "react-router";

export default function PublicRoutes({ children }: { children: React.ReactNode }) {
  if (localStorage.getItem("userToken") != null) {
    return <Navigate to={"/"} />;
  } else {
    return <>{children}</>;
  }
}
