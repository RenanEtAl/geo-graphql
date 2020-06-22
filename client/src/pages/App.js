import React from "react";
import withRoot from "../withRoot";
import Header from "../components/header.components";
import Map from "../components/map.components";

const App = () => {
  return (
    <>
      <Header />
      <Map />
    </>
  );
};

export default withRoot(App);
