import { View } from "react-native";
import React, { useState } from "react";
import { router, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Divider,
  Input,
  Layout,
  Spinner,
  Text,
} from "@ui-kitten/components";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import LottieView from "lottie-react-native";
import SignInAnimation from "@/assets/animations/SignIn.json";
import { verticalScale } from "@/src/helpers";

const setGlobalUser = async (accessToken: string) => {
  try {
    // console.log("accessToken", accessToken);
    const response = await axios.get(
      "https://vitallinkql.onrender.com/user/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
      const user = response.data?.data;
      await SecureStore.setItemAsync("user", JSON.stringify(user));
    }
  } catch (error: any) {
    alert("SignIn failed: " + error.message);
  }
};

const SignInScreen = () => {
  const { top } = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleSignIn = async () => {
    setDisabled(true);
    try {
      const response = await axios.post(
        "https://vitallinkql.onrender.com/user/login",
        { email: email, password: password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const { accessToken, ...user } = response.data?.data;
        await setGlobalUser(accessToken);
        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("validity", "true");
        setDisabled(false);
        router.replace("/");
      }
    } catch (error: any) {
      alert("Signup failed: " + error.message);
      router.reload();
    }
  };

  return (
    <Layout
      level="4"
      style={[{ flex: 1, padding: 16 }, { paddingTop: top + 32 }]}
    >
      <Stack.Screen
        options={{
          title: "Sign In",
          headerShown: false,
        }}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text category="h1">Sign In</Text>
        <Button
          appearance="ghost"
          onPress={() => router.replace("/auth/signup")}
        >
          Sign Up
        </Button>
      </View>
      <Divider />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        <LottieView
          source={SignInAnimation}
          style={{ width: 300, height: 300 }}
          autoPlay
          loop
        />
        <Input
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          size="large"
          onChangeText={setEmail}
        />

        <Input
          placeholder="Password"
          size="large"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Divider />
        <Button
          onPress={handleSignIn}
          style={{ width: "40%", marginTop: 32, height: verticalScale(50) }}
          disabled={disabled}
          accessoryLeft={() => {
            if (disabled) {
              return <Spinner size="small" />;
            }
            return <></>;
          }}
        >
          Sign In
        </Button>
      </View>
    </Layout>
  );
};

export default SignInScreen;
