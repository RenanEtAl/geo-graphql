import React, { useContext } from "react";
import { GoogleLogin } from "react-google-login";
import { GraphQLClient } from "graphql-request";
// state
import Context from "../../context";
// styles
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import { ME_QUERY } from "../../graphql/queries.graphql";
import { BASE_URL } from "../../client";

const Login = ({ classes }) => {
  // state
  const { dispatch } = useContext(Context);
  const onSuccess = async (googleUser) => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient( BASE_URL, {
        headers: { authorization: idToken },
      });
      const { me } = await client.request(ME_QUERY);
      //console.log({ data });
      dispatch({ type: "LOGIN_USER", payload: me });
      dispatch({ type: "IS_LOGGED_IN", payload: false }); // payload set to false to handle expired auth token errors
    } catch (err) {
      onFailure(err);
    }
  };

  const onFailure = (err) => {
    console.error("Error logging in", err);
    dispatch({ type: "IS_LOGGED_IN", payload: false });
  };

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: "rgb(66, 133, 244)" }}
      >
        Welcome
      </Typography>
      <GoogleLogin
        clientId="edit"
        onSuccess={onSuccess}
        isSignedIn={true}
        onFailure={onFailure}
        theme="dark"
        buttonText="Login with Google"
      />
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
};

export default withStyles(styles)(Login);
