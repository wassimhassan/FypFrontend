import { Box, Typography, Card, CardContent, Grid } from "@mui/material"
import { Group, School as SchoolIcon, Person as PersonIcon, Star, TrendingUp } from "@mui/icons-material"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import "./DashboardOverview.css"

// Mock data
const statsData = {
  totalUsers: 1247,
  totalScholarships: 89,
  totalTeachers: 34,
  totalCourses: 156,
  totalReviews: 892,
  monthlyRevenue: 45600,
  activeUsers: 1089,
  pendingApplications: 23,
}

const chartData = [
  { name: "Jan", users: 400, revenue: 2400, scholarships: 12 },
  { name: "Feb", users: 300, revenue: 1398, scholarships: 15 },
  { name: "Mar", users: 500, revenue: 9800, scholarships: 18 },
  { name: "Apr", users: 780, revenue: 3908, scholarships: 22 },
  { name: "May", users: 890, revenue: 4800, scholarships: 25 },
  { name: "Jun", users: 1200, revenue: 3800, scholarships: 28 },
]

const pieData = [
  { name: "Computer Science", value: 35, color: "#20438E" },
  { name: "Engineering", value: 25, color: "#FED784" },
  { name: "Business", value: 20, color: "#4CAF50" },
  { name: "Medicine", value: 15, color: "#FF6B6B" },
  { name: "Arts", value: 5, color: "#9C27B0" },
]

const DashboardOverview = () => {
  const StatCard = ({ title, value, icon, color, trend }) => (
    <Card
      className="dashboard-stat-card"
      sx={{ background: `linear-gradient(135deg, ${color}15, ${color}05)`, border: `1px solid ${color}30` }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ color: color, fontWeight: "bold" }}>
              {value}
            </Typography>
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp sx={{ color: "#4CAF50", fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2" sx={{ color: "#4CAF50" }}>
                  +{trend}% this month
                </Typography>
              </Box>
            )}
          </Box>
          <Box className="dashboard-stat-icon" sx={{ backgroundColor: `${color}20`, color: color }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <Box className="dashboard-overview">
      <Typography variant="h4" gutterBottom sx={{ color: "#20438E", fontWeight: "bold", mb: 3 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={statsData.totalUsers.toLocaleString()}
            icon={<Group />}
            color="#20438E"
            trend="12"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Scholarships"
            value={statsData.totalScholarships}
            icon={<SchoolIcon />}
            color="#FED784"
            trend="8"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Teachers" value={statsData.totalTeachers} icon={<PersonIcon />} color="#4CAF50" trend="5" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Reviews" value={statsData.totalReviews} icon={<Star />} color="#FF6B6B" trend="15" />
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Card className="dashboard-chart-card">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#20438E", fontWeight: "bold" }}>
                User Growth & Revenue Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stackId="1" stroke="#20438E" fill="#20438E" fillOpacity={0.6} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="2"
                    stroke="#FED784"
                    fill="#FED784"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="dashboard-chart-card">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#20438E", fontWeight: "bold" }}>
                Course Categories
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card className="dashboard-chart-card">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#20438E", fontWeight: "bold" }}>
                Monthly Scholarship Applications
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="scholarships" fill="#20438E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardOverview
