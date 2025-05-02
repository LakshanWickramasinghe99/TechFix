// controllers/reviewController.js
import Review from '../models/Review.js';

// Create a review (no auth)
export const createReview = async (req, res) => {
  const { productId } = req.params;
  const { name, rating, comment } = req.body;

  try {
    const newReview = new Review({
      product: productId,
      name,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create review', error });
  }
};

// Get all reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get reviews', error });
  }
};

// Delete a review (no auth check)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: 'Review not found' });

    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete review', error });
  }
};