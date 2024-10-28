import AppRoutes from "./Routes/Routes";
import { AuthProvider } from "./actions/authContext";
import ErrorBoundary  from "../src/Pages/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
