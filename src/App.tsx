import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HeroUIProvider } from "@heroui/system";
import Layout from "./components/layout/Layout";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import { AuthContextProvider } from "./components/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import Profile from "./components/profile/Profile";
import Notifications from "./components/notifications/Notifications";
import PostDetails from "./components/postDetails/PostDetails";
import "@fortawesome/fontawesome-free/css/all.min.css";
import PublicRoutes from "./components/publicRoutes/PublicRoutes";
import AuthLayout from "./components/authLayout/AuthLayout";
import Setting from "./components/setting/Setting";
import UsersProfile from "./components/usersProfile/UsersProfile";
import { Offline } from "react-detect-offline";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: (
              <PublicRoutes>
                <Login />
              </PublicRoutes>
            ),
          },
          {
            path: "register",
            element: (
              <PublicRoutes>
                <Register />
              </PublicRoutes>
            ),
          },
        ],
      },

      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "Setting",
        element: (
          <ProtectedRoute>
            <Setting />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "postdetails/:postId",
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "user/:userId/profile",
        element: (
          <ProtectedRoute>
            <UsersProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: (
          <div>
            <h1>Not Found</h1>
          </div>
        ),
      },
    ],
  },
]);

const queryClient = new QueryClient();

export default function App() {
  return (<>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <HeroUIProvider>
          <RouterProvider router={router} />
        </HeroUIProvider>
      </AuthContextProvider>
    </QueryClientProvider>
    <Offline>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white border border-red-200 shadow-2xl rounded-3xl p-8 max-w-sm w-full text-center flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-200">
          <h2 className="text-lg font-black text-[#1c1e21]">
            You&apos;re Offline
          </h2>
          <p className="text-xs text-[#65676b] font-medium leading-relaxed">
            Please check your internet connection. Some features may not be available until you reconnect.
          </p>
        </div>
      </div>
    </Offline>
  </>

  );
}
