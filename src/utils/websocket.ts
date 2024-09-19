// src/scripts/websocket.js
import { io } from "socket.io-client";
import { strapi } from "./constants";
import events from "events";

const socket = io(strapi.BASE_URL, {
  transports: ["websocket"],
});
// Exporting the emitter for use in SSE
export const Emitter = new events.EventEmitter();

socket.on("connect", () => {
  console.log("WebSocket connected");
});

socket.on("connect_error", (error) => {
  console.error("WebSocket connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("WebSocket disconnected:", reason);
});

socket.on("product:create", (data) => {
  Emitter.emit("product:create", { event: "product:create", data });
});

socket.on("product:update", (data) => {
  Emitter.emit("product:update", { event: "product:update", data });
});

socket.on("product:delete", (data) => {
  Emitter.emit("product:delete", { event: "product:delete", data });
});

export default socket;
