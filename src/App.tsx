import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import {
  AboutPage,
  EstimatePage,
  HomePage,
  InsightsPage,
  LocationPage,
  NotFoundPage,
  PrivacyPage,
  ServicesPage,
} from "./pages";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="estimate" element={<EstimatePage />} />
        <Route path="consultation" element={<Navigate to="/estimate#consultation" replace />} />
        <Route path="special-services" element={<Navigate to="/services" replace />} />
        <Route path="cases" element={<Navigate to="/about#principal" replace />} />
        <Route path="location" element={<LocationPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
