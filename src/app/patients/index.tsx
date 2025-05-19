import React from "react";
import { Link, router } from "expo-router";
import {
  Button,
  Card,
  CircularProgressBar,
  Icon,
  Input,
  Layout,
  List,
  Text,
} from "@ui-kitten/components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { Dimensions, View } from "react-native";
import { gql, useQuery } from "@apollo/client";

const GET_PATIENTS_BY_DOCTOR = gql`
  query Patientsbydoctor($patientsbydoctorId: ID!) {
    patientsbydoctor(id: $patientsbydoctorId) {
      id
      name
      age
      gender
      aadhaar
      admitted
    }
  }
`;

const { height, width } = Dimensions.get("window");
const PatientsScreen = () => {
  const user = JSON.parse(SecureStore.getItem("user")!);
  const { data, loading, error, refetch } = useQuery(GET_PATIENTS_BY_DOCTOR, {
    variables: { patientsbydoctorId: user?.doctor?.id as string },
  });

  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const filteredData = data?.patientsbydoctor.filter((item: any) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const { top } = useSafeAreaInsets();

  return (
    <Layout style={[{ flex: 1 }, { paddingTop: top + 32 }]} level="4">
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          paddingHorizontal: 16,
          marginBottom: 16,
        }}
      >
        <Text category="h1">Patients</Text>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Button
            onPress={async () => {
              await SecureStore.deleteItemAsync("accessToken");
              await SecureStore.deleteItemAsync("user");
              await SecureStore.setItemAsync("validity", "false");
              router.replace("/");
            }}
            appearance="ghost"
            style={{
              width: 48,
              height: 48,
            }}
            accessoryLeft={() => <Icon fill="#8F9BB3" name="log-out-outline" />}
          />
          <Button
            onPress={async () => {
              await SecureStore.deleteItemAsync("accessToken");
              await SecureStore.deleteItemAsync("isOnboarded");
              router.replace("/");
            }}
            appearance="ghost"
            style={{
              width: 48,
              height: 48,
            }}
            accessoryLeft={() => <Icon fill="#8F9BB3" name="trash-2-outline" />}
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <Input
          size="large"
          placeholder="Search Patients"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ borderRadius: height / 24 }}
        />
      </View>

      {error ? (
        <Text category="h4">{error.message}</Text>
      ) : (
        <List
          data={filteredData}
          ListHeaderComponent={() =>
            searchQuery.length === 0 &&
            ListHeader({
              data: data?.patientsbydoctor,
            })
          }
          keyExtractor={(item) => item.id}
          renderItem={CardItem}
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingTop: 8,
            paddingBottom: 64,
          }}
          style={{ borderRadius: height / 24, marginHorizontal: 8 }}
          refreshing={loading}
          onRefresh={refetch}
          bounces={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Layout>
  );
};

const CardItem = ({ item }: { item: any }): React.ReactElement => {
  return (
    <Link href={`/patients/${item.id}`} asChild style={{ marginVertical: 4 }}>
      <Card style={{ borderRadius: height / 24 - 8 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text category="h6">
            {(item.name as string).charAt(0).toUpperCase() +
              (item.name as string).slice(1).toLowerCase()}
          </Text>
          <Icon
            name={item.admitted ? "wifi-outline" : "wifi-off-outline"}
            fill={item.admitted ? "#4FDD39" : "#DD8006"}
            style={{ height: "32" }}
          />
        </View>
      </Card>
    </Link>
  );
};

const ListHeader = ({
  data,
}: {
  data: Record<string, string>[];
}): React.ReactElement => {
  if (data == undefined) {
    return <></>;
  }

  const count = data.length ?? 0;
  const admittedCount = data.filter((item: any) => item.admitted).length;
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: height / 3,
        marginVertical: 24,
        position: "relative",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: height / 32,
            color: "#5A4FCF",
            lineHeight: 32,
            fontWeight: "800",
          }}
        >
          Total Patients
        </Text>
        <Text
          style={{
            fontSize: height / 8,
            fontWeight: "900",
            color: "#5A4FCF",
          }}
        >
          {count}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
          marginBottom: height / 24,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <CircularProgressBar progress={admittedCount / count} />
          <Text category="h6" style={{ color: "#5A4FCF" }}>
            Admitted
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <CircularProgressBar progress={admittedCount / count} />
          <Text category="h6" style={{ color: "#5A4FCF" }}>
            Admitted
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <CircularProgressBar progress={admittedCount / count} />
          <Text category="h6" style={{ color: "#5A4FCF" }}>
            Admitted
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PatientsScreen;
