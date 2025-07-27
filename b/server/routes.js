// routes.js
import express from "express";
import { getAllClients, resetClients } from "./clients.js";
const router = express.Router();
import path from "path";
import { fileURLToPath } from "url";

// Handle __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "..", "..", "f", "dist");

// ✅ API and backend routes
router.get("/api", (req, res) => {
  res.send("✅ Real-time location server is running!");
});

router.get("/clients", (req, res) => {
  res.json(getAllClients());
});

router.post("/reset", (req, res) => {
  resetClients();
  res.send("🔄 All clients have been reset.");
});
// ✅ Serve only on root "/"
router.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Serve other static files like JS, CSS, etc.
router.use(express.static(frontendPath));


export default router;