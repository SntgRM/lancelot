import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AlertProvider } from "./context/AlertContext";
import Alert from "./components/alerts/Alert";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {

  return (
    <AlertProvider>
      <BrowserRouter>
        <Alert />
        <Routes>

          <Route
            path="/"
            element={<LoginPage />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>

                <DashboardPage />

              </ProtectedRoute>
            }
          />

        </Routes>

      </BrowserRouter>
    </AlertProvider>
  );
}

export default App;