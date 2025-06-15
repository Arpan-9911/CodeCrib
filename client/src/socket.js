import { io } from "socket.io-client";

const socket = io("https://codecrib.onrender.com");
export default socket;