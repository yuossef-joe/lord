import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import { router } from "@/routes";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName="!rounded-lg !shadow-lg"
      />
    </AuthProvider>
  );
}
