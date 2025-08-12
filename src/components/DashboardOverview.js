"use client"

import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip as MuiTooltip,
} from "@mui/material"
import {
  Group,
  School as SchoolIcon,
  Person as PersonIcon,
  Star,
  MenuBook,
  Refresh as RefreshIcon,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Label,
} from "recharts"
import "./DashboardOverview.css"

const API_BASE = process.env.REACT_APP_BACKEND_URL
const palette = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"]

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState("6")
  const [users, setUsers] = useState([])
  const [teachers, setTeachers] = useState([])
  const [courses, setCourses] = useState([])
  const [reviews, setReviews] = useState([])
  const [scholarships, setScholarships] = useState([])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const get = (p, opts = {}) => axios.get(`${API_BASE}${p}`, opts).then(r => r.data)

      const [u, t, c, r, s] = await Promise.all([
        get("/api/users", { headers }).catch(() => []),
        get("/api/users/teachers", { headers }).catch(() => []),
        get("/api/courses").catch(() => []),
        get("/api/reviews").catch(() => []),
        get("/api/scholarships", { headers }).catch(() => []),
      ])

      setUsers(Array.isArray(u) ? u : [])
      setTeachers(Array.isArray(t) ? t : [])
      setCourses(Array.isArray(c) ? c : [])
      setReviews(Array.isArray(r) ? r : [])
      setScholarships(Array.isArray(s) ? s : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  // helpers
  const lastNMonths = (n) => {
    const out = []
    const d = new Date()
    d.setDate(1)
    for (let i = n - 1; i >= 0; i--) {
      const dt = new Date(d.getFullYear(), d.getMonth() - i, 1)
      out.push({
        key: `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`,
        label: dt.toLocaleString(undefined, { month: "short" }),
      })
    }
    return out
  }

  const groupByMonth = (arr, key = "createdAt") => {
    const map = {}
    for (const it of arr || []) {
      const t = it?.[key] ? new Date(it[key]) : null
      if (!t || isNaN(t)) continue
      const k = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}`
      map[k] = (map[k] || 0) + 1
    }
    return map
  }

  const months = useMemo(() => lastNMonths(Number(range)), [range])

  // by-month maps
  const usersByMonth = useMemo(() => groupByMonth(users), [users])
  const scholarshipsByMonth = useMemo(() => groupByMonth(scholarships), [scholarships])
  const coursesByMonth = useMemo(() => groupByMonth(courses), [courses])
  const teachersByMonth = useMemo(() => groupByMonth(teachers), [teachers])
  const reviewsByMonth = useMemo(() => groupByMonth(reviews), [reviews])

  // area (users + scholarships)
  const areaData = useMemo(
    () =>
      months.map((m) => ({
        name: m.label,
        users: usersByMonth[m.key] || 0,
        scholarships: scholarshipsByMonth[m.key] || 0,
      })),
    [months, usersByMonth, scholarshipsByMonth]
  )

  // bars for each entity
  const barsScholarships = useMemo(
    () => months.map((m) => ({ name: m.label, value: scholarshipsByMonth[m.key] || 0 })),
    [months, scholarshipsByMonth]
  )
  const barsUsers = useMemo(
    () => months.map((m) => ({ name: m.label, value: usersByMonth[m.key] || 0 })),
    [months, usersByMonth]
  )
  const barsCourses = useMemo(
    () => months.map((m) => ({ name: m.label, value: coursesByMonth[m.key] || 0 })),
    [months, coursesByMonth]
  )
  const barsTeachers = useMemo(
    () => months.map((m) => ({ name: m.label, value: teachersByMonth[m.key] || 0 })),
    [months, teachersByMonth]
  )
  const barsReviews = useMemo(
    () => months.map((m) => ({ name: m.label, value: reviewsByMonth[m.key] || 0 })),
    [months, reviewsByMonth]
  )

  // pie (type distribution)
  const typeDistribution = useMemo(() => {
    const counts = {}
    for (const s of scholarships) {
      const type = s?.scholarship_type || "Other"
      counts[type] = (counts[type] || 0) + 1
    }
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      color: palette[i % palette.length],
    }))
  }, [scholarships])

  // trends for KPI
  const trendPct = (seriesKey) => {
    const vals = areaData.map((d) => d[seriesKey])
    if (vals.length < 2) return 0
    const prev = vals[vals.length - 2] || 0
    const curr = vals[vals.length - 1] || 0
    if (prev === 0) return curr > 0 ? 100 : 0
    return Math.round(((curr - prev) / prev) * 100)
  }

  // donut center label renderer
  const renderCenterLabel = ({ viewBox }) => {
    if (!viewBox || viewBox.cx == null || viewBox.cy == null) return null
    const { cx, cy } = viewBox
    return (
      <>
        <text x={cx} y={cy - 4} textAnchor="middle" className="donut-total">
          {scholarships.length}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" className="donut-sub">
          Scholarships
        </text>
      </>
    )
  }

  // small helper for repeated bar cards
  const EntityBarCard = ({ title, data, gradId, color }) => (
    <Card className="neo-card chart-card">
      <CardContent className="chart-pad">
        <Typography className="chart-title">{title}</Typography>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.85} />
                <stop offset="95%" stopColor={color} stopOpacity={0.25} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
            <Tooltip
              content={({ active, label, payload }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="chart-tooltip">
                    <div className="tt-title">{label}</div>
                    {payload.map((p, i) => (
                      <div key={i} className="tt-row">
                        <span className="dot" style={{ background: p.color || p.fill }} />
                        <span>Created</span>
                        <span className="tt-val">{p.value}</span>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
            <Bar dataKey="value" name="Created" fill={`url(#${gradId})`} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )

  const StatCard = ({ title, value, icon, color, trend }) => {
    const up = trend >= 0
    return (
      <Card className="neo-card kpi-card" sx={{ "--kpi-color": color }}>
        <CardContent className="kpi-content">
          <Box className="kpi-left">
            <Typography className="kpi-title">{title}</Typography>
            <Typography className="kpi-value">
              {typeof value === "number" ? value.toLocaleString() : value}
            </Typography>
            {typeof trend === "number" && (
              <Chip
                className={`kpi-trend ${up ? "up" : "down"}`}
                icon={up ? <TrendingUp /> : <TrendingDown />}
                label={`${up ? "+" : ""}${trend}% this month`}
                size="small"
              />
            )}
          </Box>
          <Box className="kpi-icon">{icon}</Box>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Box className="dashboard-overview">
        <div className="loading-container">
          <div className="loading-spinner" />
          <Typography className="loading-text">Loading dashboard data…</Typography>
        </div>
      </Box>
    )
  }

  return (
    <Box className="dashboard-overview">
      {/* Header */}
      <Box className="dash-header">
        <Box>
          <Typography className="dash-eyebrow">Admin</Typography>
          <Typography className="dash-title">Dashboard Overview</Typography>
        </Box>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <MuiTooltip title="Refresh">
            <IconButton className="ghost-btn" onClick={fetchAll}>
              <RefreshIcon />
            </IconButton>
          </MuiTooltip>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={range}
            onChange={(_, v) => v && setRange(v)}
            color="primary"
            className="range-toggle"
          >
            <ToggleButton value="6">Last 6 mo</ToggleButton>
            <ToggleButton value="12">Last 12 mo</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Box>

      {/* KPIs */}
      <Grid container spacing={2.5} className="kpi-grid">
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard title="Total Users" value={users.length} icon={<Group />} color="#3b82f6" trend={trendPct("users")} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard title="Scholarships" value={scholarships.length} icon={<SchoolIcon />} color="#10b981" trend={trendPct("scholarships")} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard title="Teachers" value={teachers.length} icon={<PersonIcon />} color="#8b5cf6" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard title="Reviews" value={reviews.length} icon={<Star />} color="#f59e0b" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard title="Courses" value={courses.length} icon={<MenuBook />} color="#ef4444" />
        </Grid>
      </Grid>

      {/* Charts row (area + donut) */}
      <Grid container spacing={2.5} className="charts-row">
        <Grid item xs={12} md={7} lg={8}>
          <Card className="neo-card chart-card" sx={{ minWidth: { md: 580 } }}>
            <CardContent className="chart-pad">
              <Typography className="chart-title">Users & Scholarships</Typography>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradSch" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                  <Tooltip
                    content={({ active, label, payload }) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div className="chart-tooltip">
                          <div className="tt-title">{label}</div>
                          {payload.map((p, i) => (
                            <div key={i} className="tt-row">
                              <span className="dot" style={{ background: p.color || p.fill }} />
                              <span>{p.name}</span>
                              <span className="tt-val">{p.value}</span>
                            </div>
                          ))}
                        </div>
                      )
                    }}
                  />
                  <Area name="Users" type="monotone" dataKey="users" stroke="#3b82f6" fill="url(#gradUsers)" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                  <Area name="Scholarships" type="monotone" dataKey="scholarships" stroke="#10b981" fill="url(#gradSch)" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5} lg={4}>
          <Card className="neo-card chart-card">
            <CardContent className="chart-pad">
              <Typography className="chart-title">Scholarship Types</Typography>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={64} outerRadius={100} paddingAngle={3} dataKey="value">
                    {typeDistribution.map((s, i) => <Cell key={i} fill={s.color} />)}
                    <Label content={renderCenterLabel} />
                  </Pie>
                  <Tooltip
                    content={({ active, label, payload }) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div className="chart-tooltip">
                          <div className="tt-title">{label}</div>
                          {payload.map((p, i) => (
                            <div key={i} className="tt-row">
                              <span className="dot" style={{ background: p.color || p.fill }} />
                              <span>{p.name}</span>
                              <span className="tt-val">{p.value}</span>
                            </div>
                          ))}
                        </div>
                      )
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <Box className="legend-grid">
                {typeDistribution.map((d, i) => (
                  <div key={i} className="legend-item">
                    <span className="legend-dot" style={{ background: d.color }} />
                    <span className="legend-name">{d.name}</span>
                    <span className="legend-val">{d.value}</span>
                  </div>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* NEW: 2x2 grid of bar charts */}
      <Grid container spacing={2.5} mt={0.5}>
        <Grid item xs={12} md={6}>
          <EntityBarCard title="Users Created per Month" data={barsUsers} gradId="gradBarUsers" color="#3b82f6" />
        </Grid>
        <Grid item xs={12} md={6}>
          <EntityBarCard title="Courses Created per Month" data={barsCourses} gradId="gradBarCourses" color="#ef4444" />
        </Grid>
        <Grid item xs={12} md={6}>
          <EntityBarCard title="Teachers Created per Month" data={barsTeachers} gradId="gradBarTeachers" color="#8b5cf6" />
        </Grid>
        <Grid item xs={12} md={6}>
          <EntityBarCard title="Reviews Created per Month" data={barsReviews} gradId="gradBarReviews" color="#f59e0b" />
        </Grid>
          <Grid item xs={12} md={6}>
          <EntityBarCard title="Scholarships Created per Month" data={barsScholarships} gradId="gradBarReviews" color="#10b981" />
        </Grid>
      </Grid>
    </Box>
  )
}