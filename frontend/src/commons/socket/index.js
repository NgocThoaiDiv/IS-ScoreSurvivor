import socketIOClient from "socket.io-client";
const ENDPOINT = "ws://127.0.0.1:8888"
export const socket = socketIOClient(ENDPOINT); 