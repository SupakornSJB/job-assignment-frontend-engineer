import { useAuth } from "contexts/AuthContext";
import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute: React.FunctionComponent<{ children: React.ReactNode; protectOnAuth: boolean, rest: any[] }> = ({
  children,
  protectOnAuth,
  ...rest
}) => {
  const { isLoggedIn } = useAuth();
  return (
    <Route
      {...rest}
      render={() =>
        isLoggedIn && protectOnAuth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;
