import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReportIcon from "@mui/icons-material/Report";
import StarIcon from "@mui/icons-material/Star";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { CircularProgress } from "@mui/material"; // For loading indicator
import { Box, Button, IconButton, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Reviews = ({ reviews, authenticatedUser, productId, fetchReviews }) => {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [newReview, setNewReview] = useState({ username: "", rating: 0, comment: "" });
    const [reviewError, setReviewError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editReview, setEditReview] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [visibleReviews, setVisibleReviews] = useState(3); // Show 3 reviews initially
    const [reviewLikes, setReviewLikes] = useState({});


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

    const handleLoadMore = () => {
        setVisibleReviews((prev) => prev + 3) // Show 3 more reviews each time
    }



    const handleEdit = (review) => {
        setEditReview(review)
        setIsEditModalOpen(true)
    }

    const closeEditModal = () => {
        setIsEditModalOpen(false)
        setEditReview(null)
    }

    const handleReviewSubmit = async () => {
        if (!authenticatedUser) {
            alert("Please login first and try again.");
            return
        }
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

    const handleUpdateSubmit = async () => {
        if (!authenticatedUser) {
            alert("You must be logged in to edit this review.")
            return
        }
        try {
            const response = await fetch(`/api/reviews/updateReview`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify({
                    review_id: editReview.id, // Assuming each review has an `id`
                    product_id: productId,
                    user_id: authenticatedUser.id,
                    rating: editReview.rating,
                    comment: editReview.comment,
                }),
            });

            if (response.ok) {
                await fetchReviews(); // Refresh reviews after update
                closeEditModal();
            } else {
                const error = await response.json();
                alert(error.error || "Failed to update review");
            }
        } catch (error) {
            console.error("Error updating review:", error);
            alert("An error occurred while updating the review.");
        }
    };


    const handleDelete = async () => {
        if (!authenticatedUser) {
            alert("You need to be logged in to delete a review.")
            return
        }
        const confirmDelete = window.confirm('Are you sure you want to delete this review')
        if (!confirmDelete) return

        try {
            const response = await fetch(`/api/reviews/deleteReview`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product_id: productId,
                    user_id: authenticatedUser.id // Assuming the user deleting the review is the one who wrote it
                })
            })
            if (response.ok) {
                alert("Review deleted successfully")
                await fetchReviews() // Refresh reviews after deletion
            } else {
                const error = await response.json()
                alert(error.error || "Failed to delete the review.")
            }
        } catch (error) {
            console.error("Error deleting review:", error)
            alert("An error occurred while deleting the review.");
        }

    };

    const handleReport = (reviewId) => {
        // Add logic for reporting a review
    };


    const generateReviewWithAI = async () => {
        if (!authenticatedUser) {
            alert("Please login to use AI-generated reviews.");
            return;
        }
        setIsGenerating(true);
        try {
            const response = await fetch("/api/reviews/generate-gemini-review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });

            const data = await response.json();

            if (response.ok) {
                // Extract rating and comment properly
                const ratingMatch = data.comment.match(/Rating:\s*(\d+)\/5/);
                const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 5; // Default to 5 if not found

                const CleanCommnet = data.comment
                    .replace(/Rating:\s*\d+\/5/, "") // Remove rating text
                    .replace(/This product \(ID: \d+\)/, `The "${data.productName}"`) // Replace product ID
                    .replace(/\*{2,}/g, "") // Remove ** or **** formatting
                    .trim(); // Clean any extra spaces
                setNewReview((prev) => ({
                    ...prev,
                    rating: rating, // Set AI-generated rating
                    comment: CleanCommnet, // Set AI-generated comment
                }));
            } else {
                console.error("Failed to generate AI review:", data.error);
            }
        } catch (error) {
            console.error("Error generating AI review:", error);
        } finally {
            setIsGenerating(false);
        }
    };


    return (
        <div className="bg-white p-8 mt-6 rounded-lg shadow-lg">
            <Typography variant="h4" component="h2" className="font-semibold text-gray-900">
                Customer Reviews
            </Typography>
            {reviews.length > 0 ? (
                <div className="mt-6 mb-6 space-y-6">
                    {reviews.sort((a, b) => (a.user_id === authenticatedUser?.id ? -1 : 1)).slice(0, visibleReviews).map((review) => (
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
                                        <span className="text-gray-600 mr-2 mb-1">Rating:</span>
                                        {Array.from({ length: review.rating }).map((_, i) => (
                                            <StarIcon key={i} className="text-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <IconButton color="primary">
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
                    {visibleReviews < reviews.length && (
                        <Button
                            onClick={handleLoadMore}
                            variant="outlined"
                            color="primary"
                            className="mt-4 mb-4 w-full"
                        >
                            Load More Reviews
                        </Button>
                    )}
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
                className="mt-6 w-full py-3 mb-4 shadow-md transition duration-300"
            >
                Write a Review
            </Button>
            <Modal open={isEditModalOpen} onClose={closeEditModal}>
                <Box
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
                >
                    <Typography variant="h5" className="font-semibold mb-4 text-gray-900">
                        Edit Review
                    </Typography>
                    <TextField
                        label="Rating (1-5)"
                        type="number"
                        value={editReview?.rating || ""}
                        onChange={(e) =>
                            setEditReview((prev) => ({ ...prev, rating: Number(e.target.value) }))
                        }
                        inputProps={{ min: 1, max: 5 }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Comment"
                        multiline
                        rows={4}
                        value={editReview?.comment || ""}
                        onChange={(e) =>
                            setEditReview((prev) => ({ ...prev, comment: e.target.value }))
                        }
                        fullWidth
                        margin="normal"
                    />
                    <div className="flex justify-between mt-6">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpdateSubmit}
                            disabled={!editReview?.rating || !editReview?.comment}
                        >
                            Update Review
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={closeEditModal}>
                            Cancel
                        </Button>
                    </div>
                </Box>
            </Modal>
            {/* Review Modal */}
            <Modal open={isReviewModalOpen} onClose={toggleReviewModal}>
                <Box
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
                >
                    <Typography variant="h5" className="font-semibold mb-4 text-gray-900">
                        Write a Review
                    </Typography>

                    {reviewError && (
                        <Typography variant="body2" className="text-red-500 mt-2">
                            {reviewError}
                        </Typography>
                    )}
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
                    <div className="mt-4 flex justify-center">
                        <Button variant="outlined" color="primary" onClick={generateReviewWithAI} disabled={isGenerating}>
                            {isGenerating ? <CircularProgress size={20} /> : "Write Review with AI (Gemini)"}
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default Reviews;
