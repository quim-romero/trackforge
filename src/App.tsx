import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import OnboardingLayout from "./components/OnboardingLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<OnboardingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
}
