import React from "react";
import { useAuth } from "contexts/AuthContext";
import { useHistory } from "react-router-dom";

export default function Logout() {
  const { logout } = useAuth();
  const history = useHistory();

  React.useEffect(() => {
    logout();
    history.push("/");
  }, [])

  return (
    <>
    </>
  );
}
