import AppRoutes from "./Routes/Routes";
import { AuthProvider } from "./actions/authContext";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
