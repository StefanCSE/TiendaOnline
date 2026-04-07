const express = require("express");
const router = express.Router();
const CartItem = require("../models/Cart");
const Product = require("../models/Product");

// POST /cart - Agregar un producto al carrito
router.post("/", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: "Faltan campos: productId, quantity" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (product.stock < parseInt(quantity)) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    // Si el producto ya esta en el carrito, sumamos la cantidad
    const existing = await CartItem.findOne({ productId });

    if (existing) {
      existing.quantity += parseInt(quantity);
      await existing.save();
    } else {
      await CartItem.create({
        productId: product._id,
        productName: product.name,
        quantity: parseInt(quantity),
        price: product.price,
      });
    }

    const cart = await CartItem.find();
    res.status(201).json({ message: "Producto agregado al carrito", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /cart - Ver el contenido del carrito
router.get("/", async (req, res) => {
  try {
    const cart = await CartItem.find();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
