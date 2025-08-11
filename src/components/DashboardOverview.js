import { useEffect, useMemo, useState } from "react"
import { Box, Typography, Card, CardContent, Grid, CircularProgress } from "@mui/material"
import { Group, School as SchoolIcon, Person as PersonIcon, Star, TrendingUp } from "@mui/icons-material"
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from "recharts"
import axios from "axios"
import "./DashboardOverview.css"

const API_BASE = process.env.REACT_APP_BACKEND_URL // <- use your .env var only

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [teachers, setTeachers] = useState([])
  const [courses, setCourses] = useState([])
  const [reviews, setReviews] = useState([])
  const [scholarships, setScholarships] = useState([])

  useEffect(() => {
    let mounted = true
    const token = localStorage.getItem("token")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    const get = (path, opts = {}) =>
      axios.get(`${API_BASE}${path}`, opts).then(r => r.data).catch(() => [])

    Promise.all([
      get("/api/users", { headers }),
      get("/api/users/teachers", { headers }),
      get("/api/courses"),
      get("/api/reviews"),
      get("/api/scholarships", { headers }),
    ]).then(([u, t, c, r, s]) => {
      if (!mounted) return
      setUsers(Array.isArray(u) ? u : [])
      setTeachers(Array.isArray(t) ? t : [])
      setCourses(Array.isArray(c) ? c : [])
      setReviews(Array.isArray(r) ? r : [])
      setScholarships(Array.isArray(s) ? s : [])
      setLoading(false)
    })

    return () => { mounted = false }
  }, [])

  // helpers
  const lastNMonths = (n = 6) => {
    const out = []
    const d = new Date(); d.setDate(1)
    for (let i = n - 1; i >= 0; i--) {
      const dt = new Date(d.getFullYear(), d.getMonth() - i, 1)
      out.push({
        key: `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`,
        label: dt.toLocaleString(undefined, { month: "short" }),
      })
    }
    return out
  }

  const groupByMonth = (arr, dateKey = "createdAt") => {
    const buckets = {}
    for (const it of arr || []) {
      const t = it?.[dateKey] ? new Date(it[dateKey]) : null
      if (!t || isNaN(t)) continue
      const k = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}`
      buckets[k] = (buckets[k] || 0) + 1
    }
    return buckets
  }

  const months = useMemo(() => lastNMonths(6), [])
  const usersByMonth = useMemo(() => groupByMonth(users), [users])
  const scholarshipsByMonth = useMemo(() => groupByMonth(scholarships), [scholarships])

  const areaChartData = useMemo(() =>
    months.map(m => ({
      name: m.label,
      users: usersByMonth[m.key] || 0,
      scholarships: scholarshipsByMonth[m.key] || 0,
    })), [months, usersByMonth, scholarshipsByMonth]
  )

  const barChartData = useMemo(() =>
    months.map(m => ({ name: m.label, scholarships: scholarshipsByMonth[m.key] || 0 })),
    [months, scholarshipsByMonth]
  )

  const scholarshipTypeData = useMemo(() => {
    const counts = {}
    for (const s of scholarships) {
      const type = s?.scholarship_type || "Other"
      counts[type] = (counts[type] || 0) + 1
    }
    const palette = ["#20438E", "#FED784", "#4CAF50", "#FF6B6B", "#9C27B0", "#009688", "#795548"]
    return Object.entries(counts).map(([name, value], i) => ({ name, value, color: palette[i % palette.length] }))
  }, [scholarships])

  const trendPct = (key) => {
    const vals = areaChartData.map(d => d[key])
    if (vals.length < 2) return 0
    const prev = vals[vals.length - 2] || 0
    const curr = vals[vals.length - 1] || 0
    if (prev === 0) return curr > 0 ? 100 : 0
    return Math.round(((curr - prev) / prev) * 100)
  }

  const StatCard = ({ title, value, icon, color, trend }) => (
    <Card className="dashboard-stat-card" sx={{ background: `linear-gradient(135deg, ${color}15, ${color}05)`, border: `1px solid ${color}30` }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" color="textSecondary" gutterBottom>{title}</Typography>
            <Typography variant="h4" component="div" sx={{ color, fontWeight: "bold" }}>
              {typeof value === "number" ? value.toLocaleString() : value}
            </Typography>
            {typeof trend === "number" && (
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp sx={{ color: trend >= 0 ? "#4CAF50" : "#FF6B6B", fontSize: 16, mr: .5 }} />
                <Typography variant="body2" sx={{ color: trend >= 0 ? "#4CAF50" : "#FF6B6B" }}>
                  {trend >= 0 ? "+" : ""}{trend}% this month
                </Typography>
              </Box>
            )}
          </Box>
          <Box className="dashboard-stat-icon" sx={{ backgroundColor: `${color}20`, color }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <Box className="dashboard-overview" display="flex" alignItems="center" justifyContent="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box className="dashboard-overview">
      <Typography variant="h4" gutterBottom sx={{ color: "#20438E", fontWeight: "bold", mb: 3 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value={users.length} icon={<Group />} color="#20438E" trend={trendPct("users")} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Scholarships" value={scholarships.length} icon={<SchoolIcon />} color="#FED784" trend={trendPct("scholarships")} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Teachers" value={teachers.length} icon={<PersonIcon />} color="#4CAF50" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Reviews" value={reviews.length} icon={<Star />} color="#FF6B6B" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Courses" value={courses.length} icon={<TrendingUp />} color="#9C27B0" />
      </Grid>
      </Grid>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Card className="dashboard-chart-card">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#20438E", fontWeight: "bold" }}>
                Users & Scholarships (Last 6 Months)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={areaChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stroke="#20438E" fill="#20438E" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="scholarships" stroke="#FED784" fill="#FED784" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="dashboard-chart-card">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#20438E", fontWeight: "bold" }}>
                Scholarship Types
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={scholarshipTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {scholarshipTypeData.map((e, i) => <Cell key={i} fill={e.color} />)}
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
                Scholarships Created per Month
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
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
