import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import PrivateRoute from "./components/PrivateRoute"
import Login from "./pages/Login"
import Dashboard from "./components/Dashboard"
import HeritageList from "./pages/HeritageList"
import HeritageAdd from "./pages/HeritageAdd"
import HeritageEdit from "./pages/HeritageEdit"
import DashboardHome from "./pages/DashboardHome"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="heritage" element={<HeritageList />} />
            <Route path="heritage/add" element={<HeritageAdd />} />
            <Route path="heritage/edit/:id" element={<HeritageEdit />} />
          </Route>

          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
