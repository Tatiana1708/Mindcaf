import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './services/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Employees from './pages/Employees';
import Equipment from './pages/Equipment';
import Procedures from './pages/Procedures';
import Departments from './pages/Departments';
import ProcedureDetails from './pages/ProcedureDetails';
import RequesterInfo from './pages/RequesterInfo';
import ChecklistForm from './pages/ChecklistForm';
import ServicesView from './pages/Services';
import PublicProcedures from './pages/public/PublicProcedures';
import PublicProcedureDetails from './pages/public/PublicProcedDetails';
import { Header } from './components/Header';
import PublicRequesterInfo from './pages/public/PublicRequesterInfo';
// import PublicChecklistForm from './pages/public/PublicChecklistForm';
// import Register from './pages/Register';
import React from 'react';
import PublicDashboard from './pages/public/PublicDashboard';
import PublicChecklistForm from './pages/public/PublicChecklistForm';
import PublicSocietyInfo from './pages/public/PublicSocietyInfo';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path='/*' 
      element={
        <div className="flex flex-col md:flex-row min-h-screen">
      {isAuthenticated && !isLandingPage && (
        <div className="md:w-64 flex-shrink-0 min-h-screen">
          <Sidebar />
        </div>
      )}
      
        {isAuthenticated && !isLandingPage && <Header />}
        <main className="flex-1 bg-gray-100 min-h-screen p-3 md:p-6 w-full mt-16">
          <Routes>
            {/* <Route path="/register" element={<Register />} /> */}
            <Route path="/services" element={<Departments />} />
            <Route path="/services" element={<PrivateRoute><Departments /></PrivateRoute>} />
            <Route path="/serviceView" element={<PrivateRoute><ServicesView /></PrivateRoute>} />
            <Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
            <Route path="/equipment" element={<PrivateRoute><Equipment /></PrivateRoute>} />
            <Route path="/procedures" element={<PrivateRoute><Procedures /></PrivateRoute>} />
            <Route path="/procedure/:procedureName" element={<ProcedureDetails />} />
            <Route path="/requester-info" element={<RequesterInfo />} />
            <Route path="/checklist" element={<ChecklistForm />} />
            <Route path="/public-service" element={<PublicProcedures />} />
            <Route path="/public-procedure/:procedureName" element={<PublicProcedureDetails />} />
            <Route path="/public-personne-info" element={<PublicRequesterInfo />} />
            <Route path="/public-checklist" element={<PublicChecklistForm />} />
            <Route path="/public-dashboard" element={<PublicDashboard />} />
            <Route path="/public-society-info" element={<PublicSocietyInfo />} />
          </Routes>
        </main>
      </div>
      }
      />
      </Routes>
    
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;