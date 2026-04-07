const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) return;

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    if (process.env.NODE_ENV === "test") return;
    throw new Error("La variable de entorno MONGODB_URI no esta definida.");
  }

  await mongoose.connect(uri);
  isConnected = true;
  console.log("Conectado a MongoDB");
}

module.exports = connectDB;
