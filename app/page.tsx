"use client";
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Test, TestAttempt } from "../lib/Interface";
// import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TestCard from "../components/TestCard";
import { testsResult, attemptsResult } from "../constants/DashboardTestCard";

export default function Home() {
  // const { student } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "all" | "active" | "attempted" | "previous"
  >("all");
  const [tests, setTests] = useState<Test[]>([]);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // if (!student) return;

    setLoading(true);
    try {
      // const [testsResult, attemptsResult] = await Promise.all([
      //   supabase.from('tests').select('*').order('posted_date', { ascending: false }),
      //   supabase.from('test_attempts').select('*').eq('student_id', student.id),
      // ]);

      if (testsResult) setTests(testsResult);
      // console.log("test:", tests);
      if (attemptsResult) setAttempts(attemptsResult);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTests = () => {
    const now = new Date();
    let filtered = tests;

    switch (activeTab) {
      case "active":
        filtered = tests.filter((test) => {
          const start = new Date(test.start_date);
          const end = new Date(test.end_date);
          return now >= start && now <= end && test.is_active;
        });
        break;
      case "attempted": {
        const attemptedTestIds = attempts.map((a) => a.test_id);
        filtered = tests.filter((test) => attemptedTestIds.includes(test.id));
        break;
      }
      case "previous":
        filtered = tests.filter((test) => {
          const end = new Date(test.end_date);
          return now > end;
        });
        break;
      default:
        filtered = tests;
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (test) =>
          test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          test.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getAttemptForTest = (testId: string) => {
    return attempts.find((a) => a.test_id === testId);
  };

  const filteredTests = getFilteredTests();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {activeTab === "all" && "All Tests"}
            {activeTab === "active" && "Active Tests"}
            {activeTab === "attempted" && "Attempted Tests"}
            {activeTab === "previous" && "Previous Tests"}
          </h1>
          <p className="text-gray-600">
            {activeTab === "all" && "Browse all available tests"}
            {activeTab === "active" && "Tests currently available for attempt"}
            {activeTab === "attempted" && "Tests you have already attempted"}
            {activeTab === "previous" && "Past tests that are no longer active"}
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <button className="bg-white border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium text-gray-700 flex items-center justify-center space-x-2 transition-all">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="mb-4">
              <div className="inline-block bg-gray-100 p-6 rounded-full">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tests found
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Try adjusting your search query"
                : `No tests available in this category`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <TestCard
                key={test.id}
                test={test}
                attempt={getAttemptForTest(test.id)}
              />
            ))}
          </div>
        )}

        {!loading && filteredTests.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Showing {filteredTests.length}{" "}
            {filteredTests.length === 1 ? "test" : "tests"}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
