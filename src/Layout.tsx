import React from "react";
import { HashRouter as Router, Switch, Route, useLocation } from "react-router-dom";

import Article from "./Article";
import ArticleList from "./ArticleList";
import Editor from "./Editor";
import LoginRegister from "./LoginRegister";
import Logout from "./Logout";
import Profile from "./Profile";
import Settings from "./Settings";
import { useAuth } from "contexts/AuthContext";
import ProtectedRoute from "ProtectedRoute";

const Layout: React.FunctionComponent = () => {
  const { isLoggedIn, user } = useAuth();

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
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <a className="nav-link" href={`/#/profile/${user?.username}`}>
                    <i className="ion-android-contact" />
                    &nbsp;My profile
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
              </>
            ) : (
              <>
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
              </>
            )}
          </ul>
        </div>
      </nav>

      <Switch>
        {/* protected */}
        <ProtectedRoute
          protectOnAuth={true}
          isAuthenticated={isLoggedIn}
          authenticationPath="/login"
          path="/editor"
          exact
        >
          <Editor />
        </ProtectedRoute>
        <ProtectedRoute
          protectOnAuth={true}
          isAuthenticated={isLoggedIn}
          authenticationPath="/login"
          path="/editor/:slug"
          exact
        >
          <Editor />
        </ProtectedRoute>
        <ProtectedRoute
          protectOnAuth={true}
          isAuthenticated={isLoggedIn}
          authenticationPath="/login"
          path="/settings"
          exact
        >
          <Settings />
        </ProtectedRoute>
        {/* <Route path="/editor" exact component={Editor} /> 
          <Route path="/editor/:slug" exact component={Editor} />
          <Route path="/settings" exact component={Settings} /> */}
        {/* nonprotected */}
        <ProtectedRoute protectOnAuth={false} isAuthenticated={isLoggedIn} authenticationPath="" path="/login" exact>
          <LoginRegister />
        </ProtectedRoute>
        <ProtectedRoute protectOnAuth={false} isAuthenticated={isLoggedIn} authenticationPath="" path="/register" exact>
          <LoginRegister />
        </ProtectedRoute>
        {/* <Route path="/login" exact component={LoginRegister} />
        <Route path="/register" exact component={LoginRegister} /> */}
        {/* normal */}
        <Route path="/profile/:username" exact component={Profile} />
        <Route path="/profile/:username/favorites" exact component={Profile} />
        <Route path="/logout" exact component={Logout} />
        <Route path="/:slug" exact component={Article} />
        <Route path="/" exact component={ArticleList} />
      </Switch>

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
};

export default Layout;
