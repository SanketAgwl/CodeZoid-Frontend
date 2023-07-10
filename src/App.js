import { useState } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import Navigation from "./components/shared/Navigation/Navigation";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Authenticate from "./pages/Authenticate/Authenticate";
import Activate from "./pages/Activate/Activate";
import Rooms from "./pages/Rooms/Rooms";
import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from "./Hooks/useLoadingWithRefresh";
import Loader from "./components/shared/Loader/Loader";
import Room from "./pages/Room/Room";
import Profile from "./pages/Profile/Profile";

function App() {
  const { loading } = useLoadingWithRefresh();
  return loading ? (
    <Loader message="Loading, please wait..." />
  ) : (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route
          path="/"
          element={
            <GuestRoute>
              {" "}
              <Home />{" "}
            </GuestRoute>
          }
        />
        <Route
          path="/authenticate"
          element={
            <GuestRoute>
              {" "}
              <Authenticate />{" "}
            </GuestRoute>
          }
        />

        <Route
          path="/activate"
          element={
            <SemiProtectedRoute>
              {" "}
              <Activate />{" "}
            </SemiProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              {" "}
              <Rooms />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/room/:id"
          element={
            <ProtectedRoute>
              {" "}
              <Room />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              {" "}
              <Profile />{" "}
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

const GuestRoute = ({ children, ...rest }) => {
  const { isAuth } = useSelector((state) => state.auth);
  if (isAuth) return <Navigate to="/rooms" />;
  else return children;
};

const SemiProtectedRoute = ({ children, ...rest }) => {
  const { user, isAuth } = useSelector((state) => state.auth);

  if (!isAuth) return <Navigate to="/" />;
  else if (isAuth && !user.activated) return children;
  else return <Navigate to="/rooms" />;
};

const ProtectedRoute = ({ children, ...rest }) => {
  const { user, isAuth } = useSelector((state) => state.auth);

  if (!isAuth) return <Navigate to="/" />;
  else if (isAuth && !user.activated) return <Navigate to="/activate" />;
  else return children;
};

export default App;
