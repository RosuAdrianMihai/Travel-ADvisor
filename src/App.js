import React, { useEffect, useState } from "react";

import { getPlacesData, getWeatherData } from "./api";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import { CssBaseline, Grid } from "@mui/material";

import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";
import PlaceDetails from "./components/PlaceDetails/PlaceDetails";

const theme = createTheme();

function App() {
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState(0);
  const [places, setPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState();
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [coordinates, setCoordinates] = useState({
    lat: 0,
    lng: 0,
  });
  const [bounds, setBounds] = useState(null);
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log(weatherData);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        console.log(latitude, longitude);
        setCoordinates({
          lat: latitude,
          lng: longitude,
        });
      }
    );
  }, []);

  useEffect(() => {
    const filteredPlaces = places?.filter((place) => {
      if (place.rating > rating) {
        return true;
      }
    });

    setFilteredPlaces(filteredPlaces);
  }, [rating, places]);

  useEffect(() => {
    if (bounds) {
      setIsLoading(true);

      getWeatherData(coordinates.lat, coordinates.lng).then((data) => {
        setWeatherData(data);
      });

      getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
        setPlaces(
          data?.filter((place) => {
            if (place.name && place.num_reviews > 0) {
              return true;
            }
          })
        );
        setFilteredPlaces([]);
        setIsLoading(false);
      });
    }
  }, [type, bounds]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Header setCoordinates={setCoordinates} />

      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces?.length ? filteredPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filteredPlaces?.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
