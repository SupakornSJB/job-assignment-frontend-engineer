import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./Layout";
import { AuthProvider } from "contexts/AuthContext";

function App() {
  return (
    <Router>
      <Switch>
        <AuthProvider>
          <Route path="/" component={Layout}></Route>
        </AuthProvider>
      </Switch>
    </Router>
  );
}

export default App;
