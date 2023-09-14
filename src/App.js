import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Home from "./pages/Home";
import Supply from "./pages/Supply";
import Stake from "./pages/Stake";
import SideBar from "./components/SideBar";
import "./App.css";
import { useStateValue } from "./StateProvider";

function App() {
  const [bar, setBar] = useState(false);
  const [showBar, setShowBar] = useState(false);

  const [paddingLeft, setPaddingLeft] = useState(false);
  const [paddingRight, setPaddingRight] = useState(false);

  let theme = useStateValue();
  const ls = localStorage.getItem("theme");

  if (ls) {
    theme = ls;
  } else {
    theme = "dark";
  }

  useEffect(() => {
    const root = window.document.documentElement;

    root.className = "";
    root.classList.add(theme);
  }, [theme]);

  useLayoutEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 1200) setBar(true);
      else setBar(false);
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <Router>
      <div className="app dark:bg-shark-500">
        <SideBar
          bar={bar}
          setBar={setBar}
          showBar={showBar}
          setShowBar={setShowBar}
          paddingLeft={paddingLeft}
          setPaddingLeft={setPaddingLeft}
          paddingRight={paddingRight}
          setPaddingRight={setPaddingRight}
        />

        {/* <div className={`app__body ${bar ? " app__body--full" : ""}`}> */}
        <div
          className={`app__body ${paddingLeft && " padding__left"} ${
            paddingRight && " padding__right"
          } ${" app__body--full"}`}
        >
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <Home
                  bar={bar}
                  setBar={setBar}
                  showBar={showBar}
                  setShowBar={setShowBar}
                  paddingLeft={paddingLeft}
                  setPaddingLeft={setPaddingLeft}
                  paddingRight={paddingRight}
                  setPaddingRight={setPaddingRight}
                />
              )}
            />

            <Route
              path="/supply"
              render={() => (
                <Supply
                  bar={bar}
                  setBar={setBar}
                  showBar={showBar}
                  setShowBar={setShowBar}
                  paddingLeft={paddingLeft}
                  setPaddingLeft={setPaddingLeft}
                  paddingRight={paddingRight}
                  setPaddingRight={setPaddingRight}
                />
              )}
            />

            <Route
              path="/stake"
              render={() => (
                <Stake
                  bar={bar}
                  setBar={setBar}
                  showBar={showBar}
                  setShowBar={setShowBar}
                  paddingLeft={paddingLeft}
                  setPaddingLeft={setPaddingLeft}
                  paddingRight={paddingRight}
                  setPaddingRight={setPaddingRight}
                />
              )}
            />

            <Redirect to="/" />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
