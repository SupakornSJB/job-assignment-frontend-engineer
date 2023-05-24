import { useState } from "react";
import { axiosInstance } from "../src/functions/axiosInstance";
import { useLocation } from "react-router";

export default function LoginRegister() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();

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

    type reqBodyType = {
      user: {
        email: string,
        password: string
        username?: string
      }
    }

    let reqRoute: string;
    let reqBody: reqBodyType;

    try {
      if (location.pathname === "/login") {
        reqRoute = "/users/login";
        reqBody = {
          user: {
            email: email,
            password: password,
          },
        };
        
      } else if (location.pathname === "/register") {
        reqRoute = "/users";
        reqBody = {
          user: {
            email: email,
            password: password,
            username: userName,
          },
        };
      } else {
        console.error("Route error");
        return;
      }

      const response = await axiosInstance.post("/users/login", reqBody);
      window.localStorage.setItem("token", response.data.user.token);
      console.log("login response: ", response);

    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <nav className="navbar navbar-light">
        <div className="container">
          <a className="navbar-brand" href="/#">
            conduit
          </a>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              {/* Add "active" class when you're on that page" */}
              <a className="nav-link active" href="/#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/editor">
                <i className="ion-compose" />
                &nbsp;New Article
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/settings">
                <i className="ion-gear-a" />
                &nbsp;Settings
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/login">
                Sign in
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/register">
                Sign up
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">{location.pathname === "/register" ? "Sign up" : "Sign in"}</h1>
              {location.pathname === "/register" ? (
                <p className="text-xs-center">
                  <a href="">Have an account?</a>
                </p>
              ) : null}

              <ul className="error-messages">
                <li>That email is already taken</li>
              </ul>

              <form onSubmit={handleSubmit}>
                {location.pathname === "/register" ? (
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Your Name"
                      onChange={handleNameChange}
                    />
                  </fieldset>
                ) : null}

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    onChange={handleEmailChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    onChange={handlePasswordChange}
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right">{location.pathname === "/register" ? "Sign Up" : "Sign In"}</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="container">
          <a href="/#" className="logo-font">
            conduit
          </a>
          <span className="attribution">
            An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
            licensed under MIT.
          </span>
        </div>
      </footer>
    </>
  );
}
