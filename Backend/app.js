import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { authRouter } from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const DB = process.env.MONGODB_URI;

const allowedOrigins = [
  'http://localhost:5173'
];

import ProductRoutes from './routes/ProductRoutes.js';


// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Serve static files (Images in "Uploads" folder)
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));


// API Routes
app.use("/api/products", ProductRoutes);

// Database Connection (simplified)
mongoose.connect(DB)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Error Handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server
// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
