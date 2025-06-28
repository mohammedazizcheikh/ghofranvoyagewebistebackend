const app = require("./app");
const connectDB = require("./config/db");
const { port } = require("./config/env");
const http = require("http");
// const { initializeSocket } = require("./config/socket");

const server = http.createServer(app);
// initializeSocket(server);

connectDB();

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
