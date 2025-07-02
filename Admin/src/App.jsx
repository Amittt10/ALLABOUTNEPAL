import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Dashboard from "./components/Dashboard";
import HeritageList from "./pages/HeritageList";
import HeritageAdd from "./pages/HeritageAdd";
import HeritageEdit from "./pages/HeritageEdit";
import DashboardHome from "./pages/DashboardHome";
import FestivalList from "./pages/FestivalList";
import FestivalAdd from "./pages/FestivalAdd";
import FestivalEdit from "./pages/FestivalEdit";
import FestivalCalendarView from "./pages/FestivalCalendarView";
// import QuizList from "./components/quiz/QuizList";
// import QuizAdd from "./components/quiz/QuizAdd";
// import QuizEdit from "./components/quiz/QuizEdit";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected admin routes with Dashboard layout */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            {/* Dashboard home page */}
            <Route index element={<DashboardHome />} />

            {/* Heritage routes */}
            <Route path="heritage" element={<HeritageList />} />
            <Route path="heritage/add" element={<HeritageAdd />} />
            <Route path="heritage/edit/:id" element={<HeritageEdit />} />

            {/* Festival routes */}
            <Route path="festivals" element={<FestivalList />} />
            <Route path="festivals/add" element={<FestivalAdd />} />
            <Route path="festivals/edit/:id" element={<FestivalEdit />} />
            <Route path="festivals/calendar" element={<FestivalCalendarView />} />

            {/* Quiz routes
            <Route path="quiz" element={<Navigate to="quiz/list" replace />} />
            <Route path="quiz/list" element={<QuizList />} />
            <Route path="quiz/add" element={<QuizAdd />} />
            <Route path="quiz/edit/:id" element={<QuizEdit />} /> */}

          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
