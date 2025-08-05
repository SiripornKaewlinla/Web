import express from "express";
import cors from "cors";
import transactionRoutes from "./routes/transactionRoutes";
import authRoutes from "./routes/authRoutes";  // เพิ่มบรรทัดนี้

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);  // เพิ่มบรรทัดนี้

export default app;
