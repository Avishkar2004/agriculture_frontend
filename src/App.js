import AppRoutes from "./Routes/Routes";
import { AuthProvider } from "./actions/authContext";
import ErrorBoundary from "../src/Pages/ErrorBoundary";

function App() {
  return (
    <div>
      <ErrorBoundary>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
