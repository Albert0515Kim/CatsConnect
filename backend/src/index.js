import "dotenv/config";
import express from 'express';
import morgan from 'morgan';
import authRouter from './routers/authRouter.js';
import profilesRouter from './routers/profilesRouter.js';
import friendsRouter from './routers/friendsRouter.js';
import messagesRouter from './routers/messagesRouter.js';

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || origin === allowedOrigin) {
    res.header('Access-Control-Allow-Origin', origin || allowedOrigin);
  }

  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ status: 'CatsConnect API running' });
});

app.use('/api/auth', authRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/friends', friendsRouter);
app.use('/api/messages', messagesRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
