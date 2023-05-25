import { Route, Redirect, RouteProps } from "react-router-dom";

export type ProtectedRouteProps = {
  isAuthenticated: boolean;
  authenticationPath: string;
  protectOnAuth: boolean
} & RouteProps;

export default function ProtectedRoute({ isAuthenticated, authenticationPath, protectOnAuth, ...routeProps }: ProtectedRouteProps) {
  if (isAuthenticated === protectOnAuth) {
    return <Route {...routeProps} />;
  } else {
    return <Redirect to={{ pathname: authenticationPath }} />;
  }
}
