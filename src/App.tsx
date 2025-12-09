import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth';
import { ProtectedRoute } from '@/components/auth';
import MainLayout from './components/layout/MainLayout';
import CRMDashboard from './pages/CRMDashboard';
import ContactManagement from './pages/ContactManagement';
import CompanyManagement from './pages/CompanyManagement';
import VehicleManagement from './pages/VehicleManagement';
import MatchingSystem from './pages/MatchingSystem';
import SalesManagement from './pages/SalesManagement';
import ReportsAnalytics from './pages/ReportsAnalytics';
import TasksActivities from './pages/TasksActivities';
import NotFound from './pages/NotFound';
import AdminPanel from './pages/AdminPanel';
import ChassisManagement from './pages/ChassisManagement';
import BodyworkManagement from './pages/BodyworkManagement';
import OpportunitiesPage from './pages/OpportunitiesPage';
import PipelineConfigPage from './pages/PipelineConfigPage';
import VehicleCategoriesManagement from './pages/VehicleCategoriesManagement';
import VehicleSubcategoriesManagement from './pages/VehicleSubcategoriesManagement';
import ChassisManufacturersManagement from './pages/ChassisManufacturersManagement';
import BodyworkManufacturersManagement from './pages/BodyworkManufacturersManagement';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<CRMDashboard />} />
              <Route path="dashboard" element={<CRMDashboard />} />
              <Route path="contacts/*" element={<ContactManagement />} />
              <Route path="companies/*" element={<CompanyManagement />} />
              <Route path="vehicles/*" element={<VehicleManagement />} />
              <Route path="matching/*" element={<MatchingSystem />} />
              <Route path="sales/*" element={<SalesManagement />} />
              <Route path="reports/*" element={<ReportsAnalytics />} />
              <Route path="tasks/*" element={<TasksActivities />} />
              <Route path="admin/*" element={<AdminPanel />} />
              <Route path="chassis-models/*" element={<ChassisManagement />} />
              <Route path="bodywork-models/*" element={<BodyworkManagement />} />
              <Route path="vehicle-categories/*" element={<VehicleCategoriesManagement />} />
              <Route path="vehicle-subcategories/*" element={<VehicleSubcategoriesManagement />} />
              <Route path="chassis-manufacturers/*" element={<ChassisManufacturersManagement />} />
              <Route path="bodywork-manufacturers/*" element={<BodyworkManufacturersManagement />} />
              <Route path="opportunities" element={<OpportunitiesPage />} />
              <Route path="opportunities/pipelines" element={<PipelineConfigPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;