import React from "react";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import Onboarding from "react-native-onboarding-swiper";
import { Colors } from "@/src/constants/Colors";
import * as SecureStore from "expo-secure-store";
import first from "@/assets/animations/Doctor.json";
import second from "@/assets/animations/Dashboard-Components.json";
import third from "@/assets/animations/Tech-Assistant.json";
import fourth from "@/assets/animations/Medical-Clipboard.json";

const OnboardingScreen = () => {
  return (
    <Onboarding
      skipToPage={3}
      pages={[
        {
          backgroundColor: Colors.onboarding.first,
          image: (
            <LottieView
              source={first}
              style={styles.onboarding}
              autoPlay
              loop
            />
          ),
          title: "Welcome to VitalLink",
          subtitle:
            "Monitor your patients’ health in real-time with advanced IoT and AI-driven insights",
        },
        {
          backgroundColor: Colors.onboarding.second,
          image: (
            <LottieView
              source={second}
              style={styles.onboarding}
              autoPlay
              loop
            />
          ),
          title: "Track Vitals Instantly",
          subtitle:
            "Receive live data updates for your patients' heart rate, blood oxygen, and temperature anytime, anywhere.",
        },
        {
          backgroundColor: Colors.onboarding.third,
          image: (
            <LottieView
              source={third}
              style={styles.onboarding}
              autoPlay
              loop
            />
          ),
          title: "AI-Powered Insights",
          subtitle:
            "Automatically generated reports help you make informed decisions, personalized for each patient’s needs.",
        },
        {
          backgroundColor: Colors.onboarding.fourth,
          image: (
            <LottieView
              source={fourth}
              style={styles.onboarding}
              autoPlay
              loop
            />
          ),
          title: "Ready to Begin?",
          subtitle:
            "Sign up or log in to start providing enhanced care for your patients today.",
        },
      ]}
      onDone={async () => {
        await SecureStore.setItemAsync("isOnboarded", "true");
        router.dismissTo("/auth");
      }}
      bottomBarHighlight={false}
      showNext={false}
      titleStyles={styles.title}
      subTitleStyles={styles.subtitle}
    />
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  onboarding: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 32,
    color: "#fdfdfd",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    color: "#fdfdfdbf",
  },
});
