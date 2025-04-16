import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import { authRouter } from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import profileRouter from './routes/profileRoutes.js';
import ProductRoutes from './routes/ProductRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const DB = process.env.MONGODB_URI;

// Configure __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

// Database Connection
mongoose.connect(DB)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Route Mounting (Fixed)
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/profile', profileRouter);
app.use('/api/products', ProductRoutes);
app.use('/api/user', profileRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Available routes:');
  console.log('GET    /api/health');
  console.log('GET    /api/user/data');
  console.log('GET    /api/profile');
  console.log('GET    /api/profile/basic');
  console.log('GET    /api/products');
});