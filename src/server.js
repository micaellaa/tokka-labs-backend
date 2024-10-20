import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import transactionRoutes from "./routes/transactionRoutes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:5234",
  methods: ["GET", "POST"],
  credentials: true, 
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("test-message");
});

app.use("/transaction", transactionRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})