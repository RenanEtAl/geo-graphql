import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import Context from "../context";
import { Paper } from "@material-ui/core";

import NoContent from "./Pin/NoContent";
import CreatePin from "./Pin/CreatePin";
import PinContent from "./Pin/PinContent";
// mobile
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

const Blog = ({ classes }) => {
  const { state } = useContext(Context);
  const { draft, currentPin } = state;
  const mobileSize = useMediaQuery("(max-width: 650px)");
  let BlogContent;
  // if the user hasn't set a draft pin
  if (!draft && !currentPin) {
    // no content
    BlogContent = NoContent;
    // if the user hasn't sent down a draft pin and selected a created pin
  } else if (draft && !currentPin) {
    // display create pin component
    BlogContent = CreatePin;
    // if the user set down the draft pin cause they want to add a new pin and there's no current pin
  } else if (!draft && currentPin) {
    // show pin content (image, etc.)
    BlogContent = PinContent;
  }
  return (
    <Paper className={mobileSize ? classes.rootMobile : classes.root}>
      <BlogContent />
    </Paper>
  );
};

const styles = {
  root: {
    minWidth: 350,
    maxWidth: 400,
    maxHeight: "calc(100vh - 64px)",
    overflowY: "scroll",
    display: "flex",
    justifyContent: "center",
  },
  rootMobile: {
    maxWidth: "100%",
    maxHeight: 300,
    overflowX: "hidden",
    overflowY: "scroll",
  },
};

export default withStyles(styles)(Blog);
