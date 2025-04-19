import express from "express";
import cors, {CorsOptions} from "cors";
import authRoutes from "./routes/Routes";

// CORS setup (you can adjust origins as needed for local)
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback:
    (err: Error | null, allow?: boolean) => void) => {
    console.log(`CORS Request from: ${origin}`);
    const allowedOrigins = ["http://localhost:3000"]; // Vite dev server? Or adjust this
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use("/v1/auth", authRoutes);

app.get("/v1", (req, res) => {
  res.json({
    message: "Deck Authentication and Account Management API runs local",
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Local server running at http://localhost:${PORT}`);
});
