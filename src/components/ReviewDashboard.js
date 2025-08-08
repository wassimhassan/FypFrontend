import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Star } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ReviewDashboard.css";

const ReviewDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openDeleteDialog = (review) => {
    setReviewToDelete(review);
    setDeleteDialogOpen(true);
  };

  const handleDeleteReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Not logged in");

    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/reviews/${reviewToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Review deleted");
      fetchReviews(); // Refresh list
    } catch (err) {
      console.error("Delete failed", err);
      toast.error(err.response?.data?.message || "Failed to delete review");
    } finally {
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  return (
    <Box className="review-dashboard">
      <ToastContainer position="top-right" autoClose={2500} theme="colored" />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: "#20438E", fontWeight: "bold" }}>
          Review Management
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} className="review-data-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review._id} hover className="review-table-row">
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" className="review-user">
                      {review.username}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          sx={{
                            color: i < review.rating ? "#FED784" : "#E0E0E0",
                            fontSize: 16,
                          }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 350, p: 1 }}>
                    <Tooltip title={review.text} arrow placement="top">
                      <span
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: "1.4em",
                          maxHeight: "2.8em",
                        }}
                      >
                        {review.text}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      size="small"
                      variant="outlined"
                      onClick={() => openDeleteDialog(review)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this review?</Typography>
          <Typography fontWeight="bold" mt={1}>{reviewToDelete?.text}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteReview}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewDashboard;
