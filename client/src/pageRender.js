import React from "react";
import { useParams } from "react-router-dom";
import NotFound from "./components/notFound";

const generatePage = (name) => {
  const component = () => require(`./pages/${name}`).default;

  try {
    return React.createElement(component());
  } catch (err) {
    return <NotFound />;
  }
};

const PageRender = () => {
  const { page, id } = useParams();

  let name = "";

  if (page) {
    name = id ? `${page}/[id]` : `${page}`;
  } else {
    name = "homePage";
  }

  return generatePage(name);
};

export default PageRender;
