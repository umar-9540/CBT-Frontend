import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Student } from "../lib/Interface";

interface AuthContextType {
  student: Student | null;
  loading: boolean;
  login: (
    rollNumber: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentData = localStorage.getItem("cbt_student");
    if (studentData) {
      // setStudent(JSON.parse(studentData));
    }
    // setLoading(false);
  }, []);

  const login = async (rollNumber: string, password: string) => {
    try {
      // const { data, error } = await supabase
      //   .from("students")
      //   .select("id, roll_number, full_name, email, created_at")
      //   .eq("roll_number", rollNumber)
      //   .eq("password", password)
      //   .maybeSingle();

      // if (error) {
      //   return { success: false, error: "Login failed. Please try again." };
      // }

      // if (!data) {
      //   return { success: false, error: "Invalid roll number or password." };
      // }

      // setStudent(data);
      // localStorage.setItem("cbt_student", JSON.stringify(data));
      return { success: true };
    } catch (err) {
      return { success: false, error: "An error occurred. Please try again." };
    }
  };

  const logout = () => {
    setStudent(null);
    localStorage.removeItem("cbt_student");
  };

  return (
    <AuthContext.Provider value={{ student, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
