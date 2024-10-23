import express from "express";
import { signup } from "./handlers/signup";
import { login } from "./handlers/login";

const app = express();
app.use(express.json());

app.post("/api/signup", signup);
app.post("/api/login", login);

app.listen(3000, () => {
  console.log("Astrology API running on port 3000");
});
