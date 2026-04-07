require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./db/connection");

const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const checkoutRouter = require("./routes/checkout");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV !== "test") {
  connectDB().catch(err => {
    console.error("Fallo conexion DB:", err);
  });
}

app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/checkout", checkoutRouter);

if (require.main === module) {
  app.listen(3000, () => {
    console.log(`Servidor corriendo en http://localhost:3000`);
  });
}

module.exports = app;
