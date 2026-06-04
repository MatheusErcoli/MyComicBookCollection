import express from "express";
import { sequelize } from "./database";
import { establishRelations } from "./models/relacoes";
import routes from "./routes";
import "dotenv/config";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

const allowedOrigins = ["http://localhost:4000", "http://127.0.0.1:4000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

async function startServer() {
  try {
    establishRelations();

    await sequelize.authenticate();
    console.log("✅ Conexão com o MySQL estabelecida.");

    app.use("/api", routes);
    app.use(errorMiddleware);

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
  }
}

startServer();