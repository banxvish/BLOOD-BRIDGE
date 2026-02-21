// src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import donorRoutes from './routes/donors';

dotenv.config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(express.json());

app.use('/api/donors', donorRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
