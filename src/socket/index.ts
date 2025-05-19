import { io } from "socket.io-client";
// import * as SecureStore from "expo-secure-store";

export const socket = io("http://vitallink.local:3000/", {
  reconnectionDelayMax: 10000,
  autoConnect: false,
});
