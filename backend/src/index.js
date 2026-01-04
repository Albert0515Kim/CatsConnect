import "dotenv/config";
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import authRouter from './routers/authRouter.js';
import profilesRouter from './routers/profilesRouter.js';
import friendsRouter from './routers/friendsRouter.js';
import messagesRouter from './routers/messagesRouter.js';

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = [
  ...(process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',').map(origin => origin.trim()) : []),
  'http://localhost:5173'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl) and matching origins
    const isAllowed = !origin || allowedOrigins.includes(origin);
    return isAllowed ? callback(null, true) : callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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
