import express, { Request, Response } from 'express';
import { prisma } from './db';

const app = express();
app.use(express.json());

app.use('/api', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
})

app.listen(3000, () => {
  console.log('Astrology API running on port 3000');
});
