import { io } from "socket.io-client";
// import * as SecureStore from "expo-secure-store";

export const socket = io("http://10.100.228.42:3000/", {
  reconnectionDelayMax: 10000,
  autoConnect: false,
});
