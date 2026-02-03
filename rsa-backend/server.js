import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import cryptoRoutes from "./routes/crypto.js";




dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;




// Middleware
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/crypto", cryptoRoutes);
// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connecté"))
.catch(err => console.error("❌ MongoDB error:", err));

app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
