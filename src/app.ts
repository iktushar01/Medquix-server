import express, { Application } from "express"
import cors from "cors"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import categoryRoutes from "./modules/categories/categories.router.js";
import medicineRoutes, { sellerRouter } from "./modules/medicine/medicine.router.js";

const app: Application = express();

app.use(cors({
  origin: process.env.APP_URL || "http://localhost:3000",
  credentials: true,
}))

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MedQuix Server is Running"
  })
})

app.use("/api/categories", categoryRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/seller/medicines", sellerRouter);
export { app }