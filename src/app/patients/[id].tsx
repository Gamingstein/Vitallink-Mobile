import React from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useQuery, gql } from "@apollo/client";
import { Button, Layout, Text } from "@ui-kitten/components";
import { Dimensions, Platform, View } from "react-native";
import LottieView from "lottie-react-native";
import MaleLottie from "@/assets/animations/male.json";
import FemaleLottie from "@/assets/animations/female.json";

const GET_PATIENT = gql`
  query ExampleQuery($patientId: ID!) {
    patient(id: $patientId) {
      id
      name
      aadhaar
      admitted
      age
      gender
      doctors {
        gender
        specification
        user {
          name
        }
      }
      hospital {
        user {
          name
        }
      }
    }
  }
`;

const { width } = Dimensions.get("window");

const titleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const PatientScreen = () => {
  const param = useLocalSearchParams();
  const { data, loading, error } = useQuery(GET_PATIENT, {
    variables: { patientId: param?.id as string },
  });
  if (loading) {
    return (
      <Layout
        level="3"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text category="h3">Loading...</Text>
      </Layout>
    );
  }
  return (
    <Layout level="3" style={[{ flex: 1, padding: 16 }]}>
      {Platform.OS === "android" && (
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Patient's Information",
          }}
        />
      )}
      <View style={{ flex: 1, alignItems: "center" }}>
        <LottieView
          source={data?.patient?.gender === "MALE" ? MaleLottie : FemaleLottie}
          autoPlay
          loop
          style={{
            width: 400,
            height: 400,
          }}
        />
        <Text category="h1">{titleCase(data?.patient?.name)}</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            paddingHorizontal: 16,
            marginVertical: 32,
          }}
        >
          <Row title="Age" value={data?.patient?.age} />
          <Row title="Gender" value={titleCase(data?.patient?.gender)} />
          <Row title="Aadhaar" value={data?.patient?.aadhaar} />
          <Row
            title="Admitted"
            value={data?.patient?.admitted ? "Yes" : "No"}
          />
          <Row title="Hospital" value={data?.patient?.hospital?.user?.name} />
        </View>
        {data?.patient?.admitted && (
          <Button
            onPress={() => router.dismissTo(`/patients/report/${param.id}`)}
            style={{ width: width * 0.5 }}
          >
            Report
          </Button>
        )}
      </View>
    </Layout>
  );
};

const Row = ({ title, value }: { title: string; value: string }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Text>{title}</Text>
      <Text>{value}</Text>
    </View>
  );
};

export default PatientScreen;
