// import { ReactNode } from "react";
// // import { useAuth } from "../contexts/AuthContext";
// import Login from "../app/login/page";

// export default function ProtectedRoute({ children }: { children: ReactNode }) {
//   // const { student, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-linear-to-br from-blue-50 to-white flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//       </div>
//     );
//   }

//   if (!student) {
//     return <Login />;
//   }

//   return <>{children}</>;
// }
