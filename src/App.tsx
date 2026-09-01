import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import {
  AboutPage,
  CasesPage,
  ConsultationPage,
  EstimatePage,
  HomePage,
  InsightsPage,
  LocationPage,
  NotFoundPage,
  PrivacyPage,
  ServicesPage,
  SpecialServicesPage,
} from "./pages";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="special-services" element={<SpecialServicesPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="cases" element={<CasesPage />} />
        <Route path="estimate" element={<EstimatePage />} />
        <Route path="consultation" element={<ConsultationPage />} />
        <Route path="location" element={<LocationPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
