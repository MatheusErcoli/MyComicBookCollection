import express from "express";
import { sequelize } from "./database"; 
import { establishRelations } from "./models/relacoes";

const app = express();
app.use(express.json());

async function startServer() {
  try {
    establishRelations();

    await sequelize.authenticate();
    console.log("✅ Conexão com o MySQL estabelecida.");

    await sequelize.sync({ alter: true });
    console.log("✅ Tabelas sincronizadas.");

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
  }
}

startServer();