const mongoose = require("mongoose");

// Antes de los tests se conecta a la Db
beforeAll(async () => {
  const uri = process.env.MONGODB_URI;
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
});

// Antes de cada test: limpia todas las colecciones
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Al final de todos los tests desconecta la Db
afterAll(async () => {
  await mongoose.disconnect();
});
