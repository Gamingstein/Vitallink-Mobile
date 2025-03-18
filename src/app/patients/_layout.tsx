import React from "react";
import { Stack } from "expo-router";
import { ApolloWrapper } from "@/src/components/ApolloWrapper";

const PatientsLayout = () => {
  return (
    <ApolloWrapper>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Patients",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="[id]"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="report/[id]"
          options={{
            title: "Patient's Report",
            headerShown: true,
          }}
        />
      </Stack>
    </ApolloWrapper>
  );
};

export default PatientsLayout;
