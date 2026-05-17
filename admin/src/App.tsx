import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { ToastContainer } from "react-toastify";
import { router } from "@/routes";
import "react-toastify/dist/ReactToastify.css";

function AppContent() {
  const { isRTL } = useLanguage();

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={isRTL}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName="!rounded-lg !shadow-lg"
      />
    </AuthProvider>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
