import express, { Application } from "express"
import cors from "cors"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app: Application = express()

app.all("/api/auth/*spliat", toNodeHandler(auth));

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MedQuix Server is Running"
  })
})

export { app }