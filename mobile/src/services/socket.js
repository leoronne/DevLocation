import socketio from "socket.io-client";

const socket = socketio("http://192.168.137.82:8080", {
  autoConnect: false
});

function subscribeToNewDevs(subscribeFunction) {
  socket.on("new_dev", subscribeFunction);
}

function connect(latitude, longitude, techs) {
  socket.io.opts.query = {
    latitude,
    longitude,
    techs: techs=== '' ? null : techs
  };
  socket.connect();
}

function disconnect() {
  if (socket.connect) {
    socket.disconnect();
  }
}

export { connect, disconnect, subscribeToNewDevs };
