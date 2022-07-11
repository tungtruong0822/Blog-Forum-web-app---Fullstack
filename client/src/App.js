import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./styles/styles.css";
import Nav from "./components/header/nav";
import Footer from "./components/footer/footer";
import PageRender from "./pageRender";
import Alert from "./components/alert/alert";
import { getHomeBlogs } from "./redux/reducer/blog";
import { refreshToken } from "./redux/reducer/auth";
import { useDispatch, useSelector } from "react-redux";
function App() {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);
  useEffect(() => {
    dispatch(getHomeBlogs(dispatch));
    dispatch(refreshToken());
  }, [dispatch]);
  return (
    <div className="container-fluid">
      <Router>
        <Alert />
        <Nav />

        <Switch>
          <Route exact path="/" component={PageRender} />
          <Route exact path="/:page" component={PageRender} />
          <Route exact path="/:page/:id" component={PageRender} />
        </Switch>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
