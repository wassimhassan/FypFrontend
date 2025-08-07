"use client"

import { useState } from "react"
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  RateReview as ReviewIcon,
  Book as BookIcon,
  Notifications,
  Settings,
  ExitToApp,
} from "@mui/icons-material"

// Import all dashboard components
import DashboardOverview from "./DashboardOverview"
import UserDashboard from "./UserDashboard"
import ScholarshipDashboard from "./ScholarshipDashboard"
import TeacherDashboard from "./TeacherDashboard"
import CourseDashboard from "./CourseDashboard"
import ReviewDashboard from "./ReviewDashboard"
import "./Admin.css"

const drawerWidth = 280

const Admin = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState("dashboard")

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, key: "dashboard" },
    { text: "Users", icon: <PeopleIcon />, key: "users" },
    { text: "Scholarships", icon: <SchoolIcon />, key: "scholarships" },
    { text: "Teachers", icon: <PersonIcon />, key: "teachers" },
    { text: "Courses", icon: <BookIcon />, key: "courses" },
    { text: "Reviews", icon: <ReviewIcon />, key: "reviews" },
  ]

  const renderContent = () => {
    switch (selectedSection) {
      case "dashboard":
        return <DashboardOverview />
      case "users":
        return <UserDashboard />
      case "scholarships":
        return <ScholarshipDashboard />
      case "teachers":
        return <TeacherDashboard />
      case "courses":
        return <CourseDashboard />
      case "reviews":
        return <ReviewDashboard />
      default:
        return <DashboardOverview />
    }
  }

  const drawer = (
    <div>
      <Toolbar>
        <Box display="flex" alignItems="center" width="100%">
          <img src="/FekraLogo.png" alt="FEKRA" style={{ height: 40, marginRight: 12 }} />
          <Typography variant="h6" sx={{ color: "#20438E", fontWeight: "bold" }}>
            Admin Panel
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={selectedSection === item.key}
              onClick={() => setSelectedSection(item.key)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#20438E15",
                  borderRight: "3px solid #20438E",
                  "& .MuiListItemIcon-root": { color: "#20438E" },
                  "& .MuiListItemText-primary": { color: "#20438E", fontWeight: "bold" },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "#fff",
          color: "#20438E",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find((item) => item.key === selectedSection)?.text || "Dashboard"}
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Settings />
          </IconButton>
          <IconButton color="inherit">
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  )
}

export default Admin
