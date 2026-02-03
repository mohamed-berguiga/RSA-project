import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔐 Route protégée
router.post("/encrypt", authMiddleware, (req, res) => {
  res.json({
    message: "Chiffrement autorisé",
    user: req.user   // info récupérée depuis le JWT
  });
});

router.post("/decrypt", authMiddleware, (req, res) => {
  res.json({
    message: "Déchiffrement autorisé",
    user: req.user
  });
});

export default router;
