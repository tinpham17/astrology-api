import express from "express";
import { signup } from "./handlers/authHandler";

const app = express();
app.use(express.json());

app.post("/api/signup", signup);

app.listen(3000, () => {
  console.log("Astrology API running on port 3000");
});
