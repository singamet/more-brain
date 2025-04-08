import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import MainContent from "./pages/MainContent";
import AuthLayout from "./layouts/AuthLayout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { useAtom } from "jotai";
import { currentUser } from "./atoms/app";
import { useQuery } from "@tanstack/react-query";
import { verify } from "./api/auth";
import { useEffect } from "react";
import { CurrentUserType } from "./lib/types";
import SharedLayout from "./layouts/SharedLayout";
import SharedContent from "./pages/SharedContent";
import Loading from "./ui/skeletons/Loading";
import NotFound from "./ui/error/NotFound";
import AppError from "./ui/error/AppError";

function App() {
  const [user, setUser] = useAtom(currentUser);
  const token = localStorage.getItem("auth");

  const query = useQuery<CurrentUserType>({
    queryKey: ["verify"],
    queryFn: () => verify(token as string),
    enabled: !!token,
  });
  useEffect(() => {
    if (!token || token === "") {
      setUser({
        isAuth: false,
      });
    } else if (query.isSuccess) {
      setUser({
        isAuth: true,
        fullname: query.data.fullname,
        email: query.data.email,
        token: localStorage.getItem("auth") as string,
        shareLink: query.data.shareLink,
      });
    } else if (query.isError) {
      localStorage.removeItem("auth");
      setUser({
        isAuth: false,
      });
    }
  }, [query.isError, query.isSuccess, query.data, setUser, token]);
  if (query.isLoading || query.isFetching || !user) {
    return <Loading />;
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />} errorElement={<AppError />}>
        <Route
          path="/"
          element={
            user && user.isAuth ? (
              <DashboardLayout />
            ) : (
              <Navigate to="auth/signin" replace />
            )
          }
        >
          <Route index element={<Navigate to="content" />} />
          <Route path="content" element={<MainContent />} />
          <Route path="content/share" element={<MainContent />} />
          <Route path="content/delete/:id" element={<MainContent />} />
          <Route path="content/create" element={<MainContent />} />
        </Route>
        <Route
          path="auth"
          element={
            user && user.isAuth ? <Navigate to="/" replace /> : <AuthLayout />
          }
        >
          <Route
            index
            element={
              user && user.isAuth ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="signin" replace />
              )
            }
          />
          <Route
            path="signin"
            element={
              user && user.isAuth ? <Navigate to="/" replace /> : <SignIn />
            }
          />
          <Route
            path="signup"
            element={
              user && user.isAuth ? <Navigate to="/" replace /> : <SignUp />
            }
          />
        </Route>
        <Route path="shared" element={<SharedLayout />}>
          <Route path=":hash" element={<SharedContent />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
}

export default App;
