import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import { loadPhonesData } from "./utils";

dotenv.config();

const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Serve static files
app.use("/static", express.static(__dirname + "/static"));

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
  const search = req.query.search as string;
  try {
    const phones = loadPhonesData();
    const filteredPhones = search
      ? phones.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      : phones;
    res.json(filteredPhones);
  } catch (error) {
    res.status(500).json({ error: "Failed to load phones data" });
  }
});
// halllllllo
app.get("/phones/:id", async (req: Request, res: Response) => {
  try {
    const phoneId = parseInt(req.params.id);
    const phones = loadPhonesData();
    const phone = phones.find((p) => p.id === phoneId);

    if (!phone) {
      return res.status(404).json({ error: "Phone not found" });
    }

    res.json(phone);
  } catch (error) {
    res.status(500).json({ error: "Failed to load phone data" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    "Server is running on http://localhost:" + (process.env.PORT || 3000)
  );
});
