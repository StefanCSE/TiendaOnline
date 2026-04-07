const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// POST /products - Crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ error: "Faltan campos: name, price, stock" });
    }

    const product = await Product.create({ name, price, stock });

    res.status(201).json({ message: "Producto creado", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /products - Listar todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
