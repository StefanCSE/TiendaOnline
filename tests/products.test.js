require("./setup");
const request = require("supertest");
const app = require("../server");

describe("Endpoints de Productos", () => {
  test("POST /products - Debe crear un producto correctamente", async () => {
    const res = await request(app).post("/products").send({
      name: "Laptop",
      price: 999.99,
      stock: 10,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.product).toHaveProperty("_id");
    expect(res.body.product.name).toBe("Laptop");
    expect(res.body.product.price).toBe(999.99);
    expect(res.body.product.stock).toBe(10);
  });

  test("POST /products - Debe fallar si faltan campos", async () => {
    const res = await request(app).post("/products").send({
      name: "Solo nombre",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("GET /products - Debe devolver la lista de productos", async () => {
    await request(app).post("/products").send({
      name: "Mouse",
      price: 25.0,
      stock: 50,
    });

    const res = await request(app).get("/products");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Mouse");
  });
});
