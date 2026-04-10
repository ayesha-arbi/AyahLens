import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Screens/landing";
import Onboarding from "./Screens/onboarding";
import Dashboard from "./Dashboard/dashboardmain";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;