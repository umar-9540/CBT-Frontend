"use client";

import { useState, useEffect } from "react";
import { Question, Test } from "@/lib/Interface";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/lib/questionApi";
import QuestionDialog from "@/components/QuestionDialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, Trash2, Edit2, Search, Filter } from "lucide-react";

export default function QuestionsPage() {
    // Tests state
    const [tests, setTests] = useState<Array<Test>>([]);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Filters
  const [filterTestId, setFilterTestId] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Unique sections for filter dropdown
  const [uniqueSections, setUniqueSections] = useState<string[]>([]);

  // Fetch questions on mount and when filters change
  useEffect(() => {
    fetchQuestions();
    fetchTests();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = questions;

    // Filter by testId
    if (filterTestId) {
      filtered = filtered.filter((q) => q.testId === filterTestId);
    }

    // Filter by section
    if (filterSection) {
      filtered = filtered.filter((q) => q.section === filterSection);
    }

    // Filter by search query (search in stem and section)
    if (searchQuery) {
      filtered = filtered.filter(
        (q) =>
          q.stem.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.section.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredQuestions(filtered);
  }, [questions, filterTestId, filterSection, searchQuery]);

  // Update unique filter options
  useEffect(() => {
    const sections = Array.from(new Set(questions.map((q) => q.section)));
    setUniqueSections(sections);
  }, [questions]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await getQuestions();
      setQuestions(data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      alert("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all tests from API
  const fetchTests = async () => {
    try {
      const res = await fetch("/api/v1/tests");
      if (!res.ok) throw new Error("Failed to fetch tests");
      const data = await res.json();
      // Map to { testId, testName }
      setTests(data.map((t: any) => ({ testId: t.testId, testName: t.testName })));
    } catch (error) {
      console.error("Failed to fetch tests:", error);
      setTests([]);
    }
  };

  const handleCreateQuestion = async (
    data: Omit<Question, "id" | "questionId">
  ) => {
    try {
      await createQuestion(data);
      alert("Question created successfully!");
      await fetchQuestions();
    } catch (error) {
      console.error("Failed to create question:", error);
      alert("Failed to create question. Please try again.");
    }
  };

  const handleUpdateQuestion = async (
    data: Omit<Question, "id" | "questionId">
  ) => {
    if (!editingQuestion?.id && !editingQuestion?.questionId) {
      alert("Invalid question ID");
      return;
    }

    try {
      const qId = editingQuestion.id || editingQuestion.questionId || "";
      await updateQuestion(qId, data);
      alert("Question updated successfully!");
      setEditingQuestion(undefined);
      await fetchQuestions();
    } catch (error) {
      console.error("Failed to update question:", error);
      alert("Failed to update question. Please try again.");
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestion(questionId);
      alert("Question deleted successfully!");
      setDeleteConfirm(null);
      await fetchQuestions();
    } catch (error) {
      console.error("Failed to delete question:", error);
      alert("Failed to delete question. Please try again.");
    }
  };

  const handleEditClick = (question: Question) => {
    setEditingQuestion(question);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingQuestion(undefined);
  };

  // Mock tests data - in real app this would come from API
  // Use real tests from API

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex flex-col">
      <Navbar activeTab="all" onTabChange={() => {}} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Question Management
              </h1>
              <p className="text-gray-600 mt-2">
                Create, edit, and manage exam questions
              </p>
            </div>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Question
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by question or section..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Test Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test
              </label>
              <select
                value={filterTestId}
                onChange={(e) => setFilterTestId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Tests</option>
                {tests.map((test) => (
                  <option key={test.testId} value={test.testId}>
                    {test.testName}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section
              </label>
              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sections</option>
                {uniqueSections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterTestId("");
                  setFilterSection("");
                  setSearchQuery("");
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="mb-4">
              <div className="inline-block bg-gray-100 p-6 rounded-full">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No questions found
            </h3>
            <p className="text-gray-600">
              {searchQuery || filterTestId || filterSection
                ? "Try adjusting your filters"
                : "Create your first question to get started"}
            </p>
          </div>
        ) : (
          /* Questions Table */
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Question
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Test
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Section
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Marks
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQuestions.map((question) => (
                  <tr
                    key={question.id || question.questionId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="line-clamp-2 text-sm text-gray-900 max-w-sm">
                        {question.stem}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {(() => {
                        console.log(tests);
                        const test = tests.find(t => t.testId === question.testId);
                        return test?.testName || question.testId;
                      })()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {question.section}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {question.type}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {question.marks}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(question)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          {deleteConfirm === (question.questionId) ? (
                            <div className="absolute right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 whitespace-nowrap">
                              <p className="text-xs text-gray-700 mb-2">
                                Sure? called
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    handleDeleteQuestion(
                                       question.questionId || ""
                                    )
                                  }
                                  className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                >
                                  No
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                setDeleteConfirm(
                                 question.questionId || ""
                                )
                              }
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Result Count */}
        {!loading && filteredQuestions.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            Showing {filteredQuestions.length} of {questions.length} questions
          </div>
        )}
      </main>

      {/* Question Dialog */}
      <QuestionDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        initialData={editingQuestion}
        onSubmit={
          editingQuestion ? handleUpdateQuestion : handleCreateQuestion
        }
        tests={tests}
        title={
          editingQuestion
            ? "Edit Question"
            : "Create New Question"
        }
      />

      <Footer />
    </div>
  );
}
