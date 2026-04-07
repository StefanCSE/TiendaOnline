require("./setup");
const request = require("supertest");
const app = require("../server");
const Product = require("../models/Product");
const CartItem = require("../models/Cart");

describe("Endpoint de Checkout", () => {
  test("POST /checkout - Debe realizar el pago correctamente", async () => {
    const productRes = await request(app).post("/products").send({
      name: "Camara",
      price: 300.0,
      stock: 5,
    });

    const productId = productRes.body.product._id;
    await request(app).post("/cart").send({ productId, quantity: 2 });

    const res = await request(app).post("/checkout");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("total");
    expect(parseFloat(res.body.total)).toBe(600.0);
    expect(res.body.itemsPurchased.length).toBe(1);
  });

  test("POST /checkout - El carrito debe quedar vacio despues del pago", async () => {
    const productRes = await request(app).post("/products").send({
      name: "Tablet",
      price: 150.0,
      stock: 3,
    });

    const productId = productRes.body.product._id;
    await request(app).post("/cart").send({ productId, quantity: 1 });
    await request(app).post("/checkout");

    const cart = await CartItem.find();
    expect(cart.length).toBe(0);
  });

  test("POST /checkout - El stock del producto debe reducirse despues del pago", async () => {
    const productRes = await request(app).post("/products").send({
      name: "Impresora",
      price: 120.0,
      stock: 10,
    });

    const productId = productRes.body.product._id;
    await request(app).post("/cart").send({ productId, quantity: 3 });
    await request(app).post("/checkout");

    const product = await Product.findById(productId);
    expect(product.stock).toBe(7);
  });

  test("POST /checkout - Debe fallar si el carrito esta vacio", async () => {
    const res = await request(app).post("/checkout");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
