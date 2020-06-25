import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";

import differenceInMinutes from "date-fns/difference_in_minutes";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
// mapbox
import ReactMapGL, { NavigationControl, Popup, Marker } from "react-map-gl";
import { Marker } from "mapbox-gl";
import PinIcon from "./pin-icon.components";
import Context from "../context";
import Blog from "./blog.components";
import { useClient } from "../client";
import { GET_PINS_QUERY } from "../graphql/queries.graphql";
import { DELETE_PIN_MUTATION } from "../graphql/mutations.graphql";

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13,
};

const Map = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);

  // getting/displaying created pins
  useEffect(() => {
    getPins();
  }, []);

  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    getUserPosition();
  }, []);

  // pin popups
  const [popup, setPopup] = useState(null);
  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };

  const handleMapClick = ({ lngLat, leftButton }) => {
    //console.log(event)
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({ type: "CREATE_DRAFT" });
    }
    const [longitude, latitude] = lngLat;
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: { longitude, latitude },
    });
  };

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    //console.log({ getPins });
    dispatch({ type: "GET_PINS", payload: getPins });
  };

  const highlightNewPin = (pin) => {
    const isNewPin =
      // current date, time the pin was created
      differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30; // last 30 minutes

    return isNewPin ? "limegreen" : "darkblue";
  };

  const handleSelectPin = (pin) => {
    setPopup(pin);
    dispatch({ type: "SET_PIN", payload: pin });
  };

  const handleDeletePin = async (pin) => {
    const variables = { pinId: pin._id };
    const { deletePin } = await client.request(DELETE_PIN_MUTATION, variables);
    dispatch({ type: "DELETE_PIN", payload: deletePin });
    setPopup(null);
  };
  const isAuthUser = () => state.currentUser._id === popup.autor._id;

  return (
    <div className={classes.root}>
      <ReactMapGL
        mapboxApiAccessToken="pk.eyJ1IjoidG9yYmpvcm4tbWFwIiwiYSI6ImNrYnF6ZThtYzEzNnQydGp5c280ODk2aG4ifQ.q0wbmqd85_eso_dKuqtlNg"
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onViewportChange={(newViewport) => setViewport(newViewport)}
        {...viewport}
      >
        {/*  NavigationControl */}
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={(newViewport) => setViewport(newViewport)}
          />
        </div>

        {/** pin for user's current position */}

        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="red" />
          </Marker>
        )}

        {/**Draft Pin */}
        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="hotpink" />
          </Marker>
        )}

        {/**Created Pins */}
        {state.pins.map((pin) => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon
              onClick={() => handleSelectPin(pin)}
              size={40}
              color={highlightNewPin(pin)}
            />
          </Marker>
        ))}

        {/** Popup Dialog for Created Pins */}
        {popup && (
          <Popup
            anchor="top"
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <img
              className={classes.popupImage}
              src={popup.image}
              alt={popup.title}
            />
            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
              </Typography>
              {isAuthUser() && (
                <Button onClick={() => handleDeletePin(popup)}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGL>
      {/* Blog Area to add Pin Content */}
      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: "flex",
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse",
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em",
  },
  deleteIcon: {
    color: "red",
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover",
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
};

export default withStyles(styles)(Map);
