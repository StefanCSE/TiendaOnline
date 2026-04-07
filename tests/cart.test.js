require("./setup");
const request = require("supertest");
const app = require("../server");

describe("Endpoints del Carrito", () => {
  test("POST /cart - Debe agregar un producto al carrito", async () => {
    // Creamos un producto primero
    const productRes = await request(app).post("/products").send({
      name: "Teclado",
      price: 45.0,
      stock: 20,
    });

    const productId = productRes.body.product._id;

    const res = await request(app).post("/cart").send({
      productId,
      quantity: 2,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.cart.length).toBe(1);
    expect(res.body.cart[0].productName).toBe("Teclado");
    expect(res.body.cart[0].quantity).toBe(2);
  });

  test("POST /cart - Debe fallar si el producto no existe", async () => {
    // ID de MongoDB valido pero inexistente
    const fakeId = "64a1b2c3d4e5f6a7b8c9d0e1";

    const res = await request(app).post("/cart").send({
      productId: fakeId,
      quantity: 1,
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  test("POST /cart - Debe fallar si no hay stock suficiente", async () => {
    const productRes = await request(app).post("/products").send({
      name: "Monitor",
      price: 200.0,
      stock: 1,
    });

    const productId = productRes.body.product._id;

    const res = await request(app).post("/cart").send({
      productId,
      quantity: 99,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Stock insuficiente");
  });

  test("GET /cart - Debe devolver el contenido del carrito", async () => {
    const productRes = await request(app).post("/products").send({
      name: "Auriculares",
      price: 60.0,
      stock: 5,
    });

    const productId = productRes.body.product._id;
    await request(app).post("/cart").send({ productId, quantity: 1 });

    const res = await request(app).get("/cart");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });
});
