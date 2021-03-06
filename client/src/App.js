import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Main from "./Pages/Main/Main.js";
import Register from "./Pages/Register/Register";
import Authentication from "./components/Authentication/Authentication";
import React from "react";
import Footer from "./components/Footer/Footer";
import { StoreProvider } from "./utils/Store"

function App() {
  return (
    <StoreProvider>
      <Router>
        <Authentication />
        <div className="App">
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/main" component={Main} />
          </Switch>
          <Footer />
        </div>
      </Router>

    </StoreProvider>
  );
}
export default App;
