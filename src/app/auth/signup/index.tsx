import axios from "axios";
import { Button, Divider, Input, Layout, Text } from "@ui-kitten/components";
import React, { useState } from "react";
import { router, Stack } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DropDownPicker from "react-native-dropdown-picker";

interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
  gender: string;
  specification: string;
  avatar: string | null;
  isAdmin: boolean;
}

const SignupScreen: React.FC = () => {
  const [openGender, setOpenGender] = useState(false);
  const [valueGender, setValueGender] = useState(null);
  const [itemsGender, setItemsGender] = useState([
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
    { label: "Other", value: "OTHER" },
  ]);
  const [openSpec, setOpenSpec] = useState(false);
  const [valueSpec, setValueSpec] = useState(null);
  const [itemsSpec, setItemsSpec] = useState([
    { label: "Cardiologist", value: "CARDIOLOGIST" },
    { label: "General", value: "GENERAL" },
    { label: "Surgeon", value: "SURGEON" },
  ]);

  const { top } = useSafeAreaInsets();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    gender: "",
    specification: "",
    avatar: null,
    isAdmin: false,
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setFormData({ ...formData, avatar: result.assets[0].uri });
    }
  };

  const handleSignup = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "avatar" && formData[key]) {
          formDataToSend.append("avatar", {
            uri: formData.avatar!,
            type: "image/jpeg",
            name: "avatar.jpg",
          } as any);
        } else {
          formDataToSend.append(key, formData[key as keyof FormData] as string);
        }
      });

      const response = await axios.post(
        "https://vitallinkql.onrender.com/user/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        router.replace("/auth");
      }
    } catch (error: any) {
      alert("Signup failed: " + error.message);
      router.dismissTo("/patients");
    }
  };

  return (
    <Layout
      level="4"
      style={[
        {
          flex: 1,
          padding: 16,
          gap: 16,
          alignItems: "center",
        },
        { paddingTop: top + 32 },
      ]}
    >
      <Stack.Screen options={{ title: "Sign Up", headerShown: false }} />

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text category="h1">Sign Up</Text>
        <Button appearance="ghost" onPress={() => router.replace("/auth")}>
          Sign In
        </Button>
      </View>

      <Divider />

      <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
        {formData.avatar ? (
          <Image source={{ uri: formData.avatar }} style={styles.avatar} />
        ) : (
          <Text
            style={{
              fontWeight: "600",
              fontFamily: "SpaceMono",
            }}
            category="p2"
          >
            Choose Avatar
          </Text>
        )}
      </TouchableOpacity>

      <Input
        placeholder="Name"
        value={formData.name}
        onChangeText={(value) => setFormData({ ...formData, name: value })}
      />

      <Input
        placeholder="Username"
        value={formData.username}
        onChangeText={(value) => setFormData({ ...formData, username: value })}
        autoCapitalize="none"
      />
      <View
        style={{
          gap: 16,
        }}
      >
        <DropDownPicker
          open={openGender}
          value={valueGender}
          items={itemsGender}
          setOpen={setOpenGender}
          setValue={setValueGender}
          setItems={setItemsGender}
          onSelectItem={(item) =>
            setFormData({ ...formData, gender: item.value! })
          }
          placeholder={"Choose your Gender."}
          placeholderStyle={{ color: "#858EA7" }}
          dropDownContainerStyle={{ backgroundColor: "#1B2136" }}
          textStyle={{ color: "#ffffff" }}
          style={{ backgroundColor: "#1B2136" }}
        />
      </View>

      <Input
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => setFormData({ ...formData, email: value })}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        placeholder="Password"
        value={formData.password}
        onChangeText={(value) => setFormData({ ...formData, password: value })}
        secureTextEntry
      />
      <View
        style={{
          gap: 16,
        }}
      >
        <DropDownPicker
          open={openSpec}
          value={valueSpec}
          items={itemsSpec}
          setOpen={setOpenSpec}
          setValue={setValueSpec}
          setItems={setItemsSpec}
          onSelectItem={(item) =>
            setFormData({ ...formData, specification: item.value! })
          }
          placeholder={"Choose your Specification."}
          placeholderStyle={{ color: "#858EA7" }}
          dropDownContainerStyle={{ backgroundColor: "#1B2136" }}
          textStyle={{ color: "#ffffff" }}
          style={{ backgroundColor: "#1B2136" }}
        />
      </View>

      <Button onPress={handleSignup} style={{ width: "40%", marginTop: 32 }}>
        Sign Up
      </Button>
    </Layout>
  );
};

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  imageUpload: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ffffff30",
    borderRadius: 100,
    marginBottom: 15,
    height: height / 6,
    width: height / 6,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
});

export default SignupScreen;
