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

// NEW: Import profile routes
import authRoutes from "./modules/auth/auth.routes.js";

import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";

const app: Application = express();

/* ======================
   GLOBAL MIDDLEWARES
====================== */

const allowedOrigins = [
  "http://localhost:3000",
  process.env.APP_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin like mobile apps or Postman
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some(allowedOrigin => {
      // Check for exact match or match without trailing slash
      const normalizedAllowed = allowedOrigin.replace(/\/$/, "");
      const normalizedOrigin = origin.replace(/\/$/, "");
      return normalizedAllowed === normalizedOrigin;
    });

    if (isAllowed) {
      return callback(null, true);
    } else {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
}));

app.use(express.json());

/* ======================
   AUTH (NO WILDCARD)
====================== */
app.use("/api/auth", toNodeHandler(auth)); // your existing auth for login/register
app.use("/api/auth", authRoutes); // NEW: profile routes (GET /me, PATCH /me)
app.use("/api/profile", authRoutes); // NEW: profile routes (GET /)

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

/* ======================
   GLOBAL ERROR HANDLER
====================== */
app.use(globalErrorHandler);

export default app;