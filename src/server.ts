import express from "express";
import { sequelize } from "./database";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Banco conectado com sucesso ✅");

    app.listen(3000, () => {
      console.log("Servidor rodando na porta 3000");
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar no banco ❌", err);
  });