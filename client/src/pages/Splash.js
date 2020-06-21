import React, { useContext } from "react";

import Login from "../components/Auth/login.auth";
import Context from "../context";
import { Redirect } from "react-router-dom";

const Splash = () => {
  const { state } = useContext(Context);
  return state.isAuth ? <Redirect to="/" /> : <Login />;
};

export default Splash;
