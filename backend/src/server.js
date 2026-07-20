import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env"),
});
console.log("Mongo connected:", !!process.env.MONGODB_URI);
console.log("OpenRouter key loaded:", !!process.env.OPENROUTER_API_KEY);
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB(process.env.MONGODB_URI);
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`FasalAI API running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}
start();
