import express from "express";
import { signup } from "./handlers/signup";
import { login } from "./handlers/login";
import { updateUserZodiacSign } from "./handlers/updateUserZodiacSign";
import { auth } from "./middlewares/auth";

const app = express();
app.use(express.json());

app.post("/api/signup", signup);
app.post("/api/login", login);
app.put("/api/sign", auth, updateUserZodiacSign);

app.listen(3000, () => {
  console.log("Astrology API running on port 3000");
});
