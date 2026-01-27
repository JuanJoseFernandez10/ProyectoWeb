import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import AppRouter from "./router/AppRouter";


function App() {
  return (
    <AuthProvider>
      <AppRouter></AppRouter>
    </AuthProvider>
  );
}

export default App;
