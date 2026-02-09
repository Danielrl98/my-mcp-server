import express from "express";
import dotenv from "dotenv";
import editRoute from "./routes/edit.route";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));

app.use("/edit", editRoute);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 MCP Server rodando na porta ${PORT}`);
});
