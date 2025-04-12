import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import Layout from "./components/Layout";
import OnboardingLayout from "./components/OnboardingLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const About = lazy(() => import("./pages/About"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Stats = lazy(() => import("./pages/Stats"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";

export default function App() {
  return (
    <Router>
      <main
        id="main-content"
        role="main"
        tabIndex={-1}
        className="min-h-screen focus:outline-none"
      >
        <Suspense fallback={null}>
          <Routes>
            {/* Public routes */}
            <Route element={<OnboardingLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Route>

            {/* Protected routes */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/projects" element={<Projects />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}
