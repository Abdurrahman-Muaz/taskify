import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import entryRoutes from "./routes/entry.route.js";
import userRoutes from "./routes/user.route.js";
import tagRoutes from "./routes/tag.route.js";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Düzeltilmiş cors değeri
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/entry", entryRoutes);
app.use("/api/tag", tagRoutes);
// Listen Port
app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port htpp://localhost:" + PORT);
});
