import { useState } from "react";
import { useLocation, useHistory } from "react-router";
import { AxiosError } from "axios";
import { useAuth } from "contexts/AuthContext";
import { IAuthResponse } from "interface/userProfile";

export default function LoginRegister() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTaken, setEmailTaken] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const { login, register } = useAuth();

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setUserName(e.target.value);
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setPassword(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let authResponse: IAuthResponse | null = null;

    if (location.pathname === "/login") {
      authResponse = await login({
        email,
        password,
      });
    } else if (location.pathname === "/register") {
      authResponse = await register({
        email,
        password,
        username: userName,
      });
    } else {
      console.error("Route error");
      return;
    }

    if (authResponse.userData) {
      return;
    }

    setEmailTaken(false);
    if (authResponse.fullResponse instanceof AxiosError && authResponse.fullResponse.response?.status) {
      switch (authResponse.fullResponse.response?.status) {
        case 409:
          setEmailTaken(true);
          break;
      }
      return;
    }
  }

  return (
    <>
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">{location.pathname === "/register" ? "Sign up" : "Sign in"}</h1>
              {location.pathname === "/register" ? (
                <p className="text-xs-center">
                  <a href="/#/login">Have an account?</a>
                </p>
              ) : null}

              {emailTaken ? (
                <ul className="error-messages">
                  <li>Email or username is already taken</li>
                </ul>
              ) : null}

              <form onSubmit={handleSubmit}>
                {location.pathname === "/register" ? (
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Your Name"
                      onChange={handleNameChange}
                      value={userName}
                    />
                  </fieldset>
                ) : null}

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    onChange={handleEmailChange}
                    value={email}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    onChange={handlePasswordChange}
                    value={password}
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right">
                  {location.pathname === "/register" ? "Sign Up" : "Sign In"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
