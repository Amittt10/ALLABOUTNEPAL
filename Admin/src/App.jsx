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

import PlaceAdd from "./pages/PlaceAdmin/PlaceAdd";
import PlaceEdit from "./pages/PlaceAdmin/PlaceEdit";
import PlaceList from "./pages/PlaceAdmin/PlaceList";

import QuizList from './pages/quiz/QuizList';
import QuizAdd from './pages/quiz/QuizAdd';
import QuizEdit from './pages/quiz/QuizEdit';

import AdminUsers from './pages/AdminUsers';
import AdminQuizStats from "./pages/AdminQuizStats";

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

            
            <Route path="places" element={<PlaceList />} />
            <Route path="places/add" element={<PlaceAdd />} />
            <Route path="places/edit/:id" element={<PlaceEdit />} />
          

            <Route path="/admin/quiz" element={<PrivateRoute><QuizList /></PrivateRoute>} />
            <Route path="/admin/quiz/add" element={<PrivateRoute><QuizAdd /></PrivateRoute>} />
            <Route path="/admin/quiz/edit/:id" element={<PrivateRoute><QuizEdit /></PrivateRoute>} />

            {/* Pagination Routes */}
             <Route path="/admin/users" element={<AdminUsers />} />
             <Route path="/admin/quiz-attempts" element={<AdminQuizStats />} />
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
