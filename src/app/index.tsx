import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const checkValidity = async () => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (!token) {
    SecureStore.setItemAsync("validity", "false");
    return false;
  }
  try {
    const res = await axios.get("https://vitallinkql.onrender.com/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    SecureStore.setItemAsync("validity", res.status === 200 ? "true" : "false");
    return true;
  } catch (error) {
    SecureStore.setItemAsync("validity", "false");
    return false;
  }
};

const HomeScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    checkValidity().then((validity) => {
      console.log({ validity });
    });

    const log = SecureStore.getItem("validity") === "true";
    const onboard = SecureStore.getItem("isOnboarded") === "true";
    setIsLoggedIn(log);
    setIsOnboarded(onboard);
  }, []);

  if (isLoggedIn) {
    return <Redirect href={"/patients"} />;
  }
  if (isOnboarded && !isLoggedIn) {
    return <Redirect href={"/auth"} />;
  }
  return <Redirect href={"/onboarding"} />;
};

export default HomeScreen;
