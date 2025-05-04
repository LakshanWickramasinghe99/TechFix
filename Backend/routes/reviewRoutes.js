import express from 'express';
import {
  createReview,
  getProductReviews,
  deleteReview,
} from '../controllers/reviewController.js';

const router = express.Router();

// POST a new review
router.post('/:productId', createReview);

// GET all reviews for a product
router.get('/:productId', getProductReviews);

// DELETE a review (no auth)
router.delete('/:id', deleteReview);

export default router;