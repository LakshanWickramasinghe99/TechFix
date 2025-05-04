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

import connectDB from './config/db.js';
import itemRoutes from './routes/itemRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import bodyParser from 'body-parser';


dotenv.config();
// MongoDB connection
connectDB();

const app = express();
const port = process.env.PORT || 5000;
const DB = process.env.MONGODB_URI;


// Configure __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  'http://localhost:5173'
];




// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use('/Productuploads', express.static('Productuploads'));


// Static files
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));



// API Routes
// app.use("/api/products", ProductRoutes);
app.use('/api', itemRoutes);


// Database Connection (simplified)

mongoose.connect(DB)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Route Mounting (Fixed)
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

app.use('/api/profile', profileRouter);
app.use('/api/products', ProductRoutes);
// Removed duplicate mounting of profileRouter on '/api/user' to avoid conflicts.

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