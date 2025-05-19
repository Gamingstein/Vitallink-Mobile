import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Divider, Layout, Text } from "@ui-kitten/components";
import { socket } from "@/src/socket";
import { LineChart } from "react-native-gifted-charts";
import { Dimensions, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { scale } from "@/src/helpers";

type graphDataItem = {
  value: number;
  label?: any;
};

type SensorData = {
  timestamp: number;
  topic: string;
  sensorData: {
    temperature: number;
    spo2: number;
    heartrate: number;
  };
  sensorID: string;
};

const { height } = Dimensions.get("window");

const initialData = [
  { value: 0 },
  { value: 0 },
  { value: 0 },
  { value: 0 },
  { value: 0 },
  { value: 0 },
  { value: 0 },
  { value: 0 },
  { value: 0 },
  { value: 0 },
];

const PatientReportScreen = () => {
  const param = useLocalSearchParams();
  const [sensorData, setSensorData] = useState<SensorData>();
  const [graphTempData, setGraphTempData] =
    useState<graphDataItem[]>(initialData);
  const [graphSpo2Data, setGraphSpo2Data] =
    useState<graphDataItem[]>(initialData);
  const [graphHeartrateData, setGraphHeartrateData] =
    useState<graphDataItem[]>(initialData);

  useEffect(() => {
    socket.auth = { token: SecureStore.getItem("accessToken") };
    socket
      .connect()
      .emit("subscribe", param?.id)
      .on("sensor-data", (data: any) => {
        if (data.timestamp !== sensorData?.timestamp) {
          setSensorData(data);
          const formattedData = dataFormatter(data);
          setGraphTempData((prev) => {
            prev.shift();

            return [...prev, formattedData.temperature];
          });
          setGraphSpo2Data((prev) => {
            prev.shift();

            return [...prev, formattedData.spo2];
          });
          setGraphHeartrateData((prev) => {
            prev.shift();

            return [...prev, formattedData.heartrate];
          });
        }
      });
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param?.id]);

  return (
    <Layout
      level="1"
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <View
        style={{
          width: "100%",
          height: "auto",
          paddingHorizontal: 16,
          gap: 16,
        }}
      >
        <CustomChart
          data={graphTempData}
          label="Temperature"
          unit="°F"
          quantity={sensorData?.sensorData.temperature}
        />
        <Divider />
        <CustomChart
          data={graphSpo2Data}
          label="Blood Oxygen"
          unit="%"
          quantity={sensorData?.sensorData.spo2}
        />
        <Divider />

        <CustomChart
          data={graphHeartrateData}
          label="Heart Rate"
          unit="Bpm"
          quantity={sensorData?.sensorData.heartrate}
          color="#F23535"
        />
      </View>
    </Layout>
  );
};

const CustomChart = ({
  data,
  label,
  unit = "",
  quantity = 0,
  color = "#5A4FCF",
}: {
  data: graphDataItem[];
  label: string;
  unit?: string;
  quantity?: number;
  color?: string;
}) => {
  return (
    <View
      style={{
        width: "100%",
        height: "auto",
        display: "flex",
        gap: 16,
      }}
    >
      <Text category="h1" style={{ fontWeight: "700" }}>
        {label}
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 16,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            overflow: "hidden",
            backgroundColor: "#C3BCFA0f",
            width: scale(225),
            height: height / 8,
            borderRadius: 8,
            position: "relative",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "100%",
              height: "auto",
            }}
          >
            <LineChart
              initialSpacing={0}
              data={data}
              spacing={30}
              hideDataPoints
              thickness={2}
              hideYAxisText
              hideAxesAndRules
              color={color}
              height={height / 9}
              scrollToEnd
              areaChart
              startFillColor={color}
              startOpacity={0.8}
              endFillColor={color}
              endOpacity={0.3}
            />
          </View>
        </View>
        <View
          style={{
            display: "flex",
            gap: 4,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text category="h1">{quantity}</Text>
          <Text category="h6" style={{ color: "#C3BCFA" }}>
            {unit}
          </Text>
        </View>
      </View>
    </View>
  );
};

const dataFormatter = (data: any) => {
  const { temperature, spo2, heartrate } = data.sensorData;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).format(new Date(data.timestamp));

  return {
    temperature: { value: (parseFloat(temperature) - 80) / 30 },
    spo2: { value: (parseFloat(spo2) - 90) / 10 },
    heartrate: { value: (parseFloat(heartrate) - 60) / 60 },
  };
};

export default PatientReportScreen;
