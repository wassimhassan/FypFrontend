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
  Chip,
  Button,
} from "@mui/material"
import { Star } from "@mui/icons-material"
import "./ReviewDashboard.css"

const mockReviews = [
  {
    id: 1,
    user: "John Doe",
    rating: 5,
    comment: "Excellent platform! Really helped me find scholarships.",
    date: "2024-01-20",
    status: "Approved",
  },
  {
    id: 2,
    user: "Jane Smith",
    rating: 4,
    comment: "Great courses and teachers. Highly recommend!",
    date: "2024-01-18",
    status: "Approved",
  },
  {
    id: 3,
    user: "Mike Johnson",
    rating: 5,
    comment: "Amazing experience. The SAT prep course was fantastic.",
    date: "2024-01-15",
    status: "Pending",
  },
  {
    id: 4,
    user: "Sarah Wilson",
    rating: 3,
    comment: "Good platform but could use more features.",
    date: "2024-01-12",
    status: "Approved",
  },
]

const ReviewDashboard = () => {
  return (
    <Box className="review-dashboard">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: "#20438E", fontWeight: "bold" }}>
          Review Management
        </Typography>
      </Box>

      <TableContainer component={Paper} className="review-data-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockReviews.map((review) => (
              <TableRow key={review.id} hover className="review-table-row">
                <TableCell>
                  <Typography variant="body2" fontWeight="bold" className="review-user">
                    {review.user}
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
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 300 }} className="review-comment">
                    {review.comment}
                  </Typography>
                </TableCell>
                <TableCell className="review-date">{review.date}</TableCell>
                <TableCell>
                  <Chip
                    label={review.status}
                    color={review.status === "Approved" ? "success" : "warning"}
                    size="small"
                    className="review-status-chip"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" className="review-action-btn">
                    {review.status === "Pending" ? "Approve" : "Edit"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ReviewDashboard
