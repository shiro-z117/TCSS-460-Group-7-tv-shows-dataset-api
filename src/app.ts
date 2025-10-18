// app.ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { openRouter } from './routes/open';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));
app.get('/readyz', (_req, res) => res.json({ status: 'ready' }));

app.use('/api', openRouter);

export default app;
