import express from "express";
import { auth } from "./middlewares/auth";
import { signup } from "./handlers/signup";
import { login } from "./handlers/login";
import { updateUserZodiacSign } from "./handlers/updateUserZodiacSign";
import { getFortune } from "./handlers/getFortune";

const PORT = 3000;

const app = express();
app.use(express.json());

app.post("/api/signup", signup);
app.post("/api/login", login);
app.put("/api/sign", auth, updateUserZodiacSign);
app.get("/api/fortune", auth, getFortune);

app.listen(PORT, () => {
  console.log(`Astrology API running on port ${PORT}`);
});
