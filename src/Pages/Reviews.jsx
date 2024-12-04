import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography, IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportIcon from "@mui/icons-material/Report";
import { Link } from "react-router-dom";

const Reviews = ({ reviews, authenticatedUser, productId, fetchReviews }) => {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [newReview, setNewReview] = useState({ username: "", rating: 0, comment: "" });
    const [reviewError, setReviewError] = useState(null);

    const toggleReviewModal = () => {
        setIsReviewModalOpen(!isReviewModalOpen);
        if (!isReviewModalOpen) {
            setNewReview({
                username: authenticatedUser ? authenticatedUser.username : "",
                rating: 0,
                comment: "",
            });
        }
    };

    const handleReviewSubmit = async () => {
        try {
            const response = await fetch("/api/reviews/addreviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product_id: productId,
                    user_id: authenticatedUser.id,
                    username: authenticatedUser.username,
                    rating: newReview.rating,
                    comment: newReview.comment,
                }),
            });

            if (response.ok) {
                await fetchReviews();
                toggleReviewModal();
                setReviewError(null);
            } else if (response.status === 400) {
                const errorData = await response.json();
                setReviewError(errorData.error);
            } else {
                console.error("Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    const handleLike = (reviewId) => {
        console.log(`Liked review with ID: ${reviewId}`);
        // Add logic for liking a review
    };

    const handleEdit = (review) => {
        console.log(`Editing review: ${review}`);
        // Add logic for editing a review
    };

    const handleDelete = (reviewId) => {
        console.log(`Deleting review with ID: ${reviewId}`);
        // Add logic for deleting a review
    };

    const handleReport = (reviewId) => {
        console.log(`Reported review with ID: ${reviewId}`);
        // Add logic for reporting a review
    };

    return (
        <div className="bg-white p-8 mt-6 rounded-lg shadow-lg">
            <Typography variant="h4" component="h2" className="font-semibold text-gray-900">
                Customer Reviews
            </Typography>
            {reviews.length > 0 ? (
                <div className="mt-6 space-y-6">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="border p-6 rounded-lg shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography variant="h6" className="font-bold text-gray-800">
                                        {review.username}
                                    </Typography>
                                    <div className="flex items-center">
                                        {Array.from({ length: review.rating }).map((_, i) => (
                                            <StarIcon key={i} className="text-yellow-500" />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleLike(review.id)}
                                    >
                                        <ThumbUpAltIcon />
                                    </IconButton>
                                    {authenticatedUser && authenticatedUser.id === review.user_id && (
                                        <>
                                            <IconButton
                                                color="secondary"
                                                onClick={() => handleEdit(review)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(review.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )}
                                    <IconButton
                                        color="error"
                                        onClick={() => handleReport(review.id)}
                                    >
                                        <ReportIcon />
                                    </IconButton>
                                </div>
                            </div>
                            <Typography variant="body1" className="mt-4 text-gray-700">
                                {review.comment}
                            </Typography>
                        </div>
                    ))}
                </div>
            ) : (
                <Typography variant="body1" className="mt-6 text-gray-600 text-lg">
                    No reviews yet. Be the first to review this product!
                </Typography>
            )}
            <Button
                onClick={toggleReviewModal}
                variant="contained"
                color="primary"
                className="mt-6 w-full py-3 shadow-md transition duration-300"
            >
                Write a Review
            </Button>

            {/* Review Modal */}
            <Modal open={isReviewModalOpen} onClose={toggleReviewModal}>
                <Box
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
                >
                    <Typography variant="h5" className="font-semibold mb-4 text-gray-900">
                        Write a Review
                    </Typography>
                    <Typography variant="body2" className="mb-4 text-gray-600">
                        {authenticatedUser ? (
                            <span className="font-medium">{authenticatedUser.username}</span>
                        ) : (
                            <span>
                                <Link to="/Signup" className="text-blue-600 hover:underline">
                                    Sign up
                                </Link>{" "}
                                or
                                <Link to="/Signin" className="ml-2 text-blue-600 hover:underline">
                                    Sign in
                                </Link>{" "}
                                to leave a review.
                            </span>
                        )}
                    </Typography>
                    {reviewError && (
                        <Typography variant="body2" className="text-red-500 mt-2">
                            {reviewError}
                        </Typography>
                    )}
                    <TextField
                        label="Rating (1-5)"
                        type="number"
                        value={newReview.rating}
                        onChange={(e) =>
                            setNewReview((prev) => ({ ...prev, rating: Number(e.target.value) }))
                        }
                        inputProps={{ min: 1, max: 5 }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Comment"
                        multiline
                        rows={4}
                        value={newReview.comment}
                        onChange={(e) =>
                            setNewReview((prev) => ({ ...prev, comment: e.target.value }))
                        }
                        fullWidth
                        margin="normal"
                    />
                    <div className="flex justify-between mt-6">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleReviewSubmit}
                            disabled={!newReview.rating || !newReview.comment}
                        >
                            Submit Review
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={toggleReviewModal}>
                            Cancel
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default Reviews;
