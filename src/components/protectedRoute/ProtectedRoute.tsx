import { Navigate } from "react-router";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (localStorage.getItem("userToken") != null) {
    return <>{children}</>;
  } else {
    return <Navigate to={"/login"} />;
  }
}
