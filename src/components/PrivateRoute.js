// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../atoms/authState";

const PrivateRoute = ({ component: Component }) => {
  const { isLoggedIn, userId } = useRecoilValue(authState);

  if (!isLoggedIn && !userId) {
    return <Navigate to="/auth" />;
  }

  return <Component />;
};

export default PrivateRoute;
