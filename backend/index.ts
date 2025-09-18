import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";

dotenv.config();

const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.get("/phones", async (req: Request, res: Response) => {
  try {
    const phonesData = fs.readFileSync(
      path.join(__dirname, "static", "phones.json"),
      "utf8"
    );
    const phones = JSON.parse(phonesData);
    res.json(phones);
  } catch (error) {
    console.error("Error reading phones data:", error);
    res.status(500).json({ error: "Failed to load phones data" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    "Server is running on http://localhost:" + (process.env.PORT || 3000)
  );
});
