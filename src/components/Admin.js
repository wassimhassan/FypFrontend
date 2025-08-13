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
} from "@mui/material"
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  RateReview as ReviewIcon,
  Book as BookIcon,
  ExitToApp,
} from "@mui/icons-material"

import ApartmentIcon from '@mui/icons-material/Apartment';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import "./Admin.css"

const drawerWidth = 280

const Admin = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()                 // ✅ init navigate

  const handleDrawerToggle = () => setMobileOpen((p) => !p)

  const handleExitClick = () => {
    navigate("/admin")                           // ✅ go to /admin
  }

  // Side menu items -> router paths under /admin/*
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "" },               // /admin
    { text: "Users", icon: <PeopleIcon />, path: "user" },                  // /admin/user
    { text: "Scholarships", icon: <SchoolIcon />, path: "scholarship" },    // /admin/scholarship
    { text: "Teachers", icon: <PersonIcon />, path: "teacher" },            // /admin/teacher
    { text: "Courses", icon: <BookIcon />, path: "course" },                // /admin/course
    { text: "Reviews", icon: <ReviewIcon />, path: "review" },              // /admin/review
    { text: "Universities", icon: <ApartmentIcon />, path: "university" },              // /admin/university
    { text: "Careers", icon: <AutoStoriesIcon />, path: "career" },              // /admin/university

  ]

  // Title from current path
  const current = (() => {
    const seg = pathname.split("/")[2] || ""
    const map = {
      "": "Dashboard",
      user: "Users",
      scholarship: "Scholarships",
      teacher: "Teachers",
      course: "Courses",
      review: "Reviews",
    }
    return map[seg] ?? "Dashboard"
  })()

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
        {menuItems.map((item) => {
          const to = item.path ? `/admin/${item.path}` : "/admin"
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={NavLink}
                to={to}
                end={!item.path} // only the dashboard (index) uses "end"
                className={({ isActive }) => (isActive ? "active" : "")}
                sx={{
                  "&.active": {
                    backgroundColor: "#20438E15",
                    borderRight: "3px solid #20438E",
                    "& .MuiListItemIcon-root": { color: "#20438E" },
                    "& .MuiListItemText-primary": { color: "#20438E", fontWeight: "bold" },
                  },
                }}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          )
        })}
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
            {current}
          </Typography>
          {pathname !== "/admin" && (
            <IconButton color="inherit" onClick={handleExitClick}>
              <ExitToApp />
            </IconButton>
          )}

        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Mobile drawer */}
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

        {/* Desktop drawer */}
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
        {/* Nested routes render here */}
        <Outlet />
      </Box>
    </Box>
  )
}

export default Admin
