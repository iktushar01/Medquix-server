import express, { Application } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

import categoryRoutes from "./modules/categories/categories.router.js";
import medicineRoutes, { sellerRouter } from "./modules/medicine/medicine.router.js";
import cartRoutes from "./modules/carts/carts.router.js";
import orderRoutes from "./modules/orders/orders.router.js";
import sellerOrderRoutes from "./modules/orders/sellerOrders.router.js";
import reviewRoutes from "./modules/reviews/reviews.router.js";
import adminUserRoutes from "./modules/adminUsers/adminUsers.router.js";
import adminOrdersRoutes from "./modules/adminUsers/adminOrders.router.js";
import adminMedicinesRoutes from "./modules/adminUsers/adminMedicines.router.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";

const app: Application = express();

/* ======================
   GLOBAL MIDDLEWARES
====================== */

app.use(cors({
  origin: process.env.APP_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

/* ======================
   AUTH (NO WILDCARD)
====================== */
app.use("/api/auth", toNodeHandler(auth));

/* ======================
   HEALTH CHECK
====================== */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MedQuix Server is Running",
  });
});

/* ======================
   ROUTES
====================== */
app.use("/api/categories", categoryRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/seller/medicines", sellerRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/seller/orders", sellerOrderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/orders", adminOrdersRoutes);
app.use("/api/admin/medicines", adminMedicinesRoutes);


app.use(globalErrorHandler);
export { app };
