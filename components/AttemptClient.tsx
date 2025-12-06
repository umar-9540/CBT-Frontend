"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { useEffect, useMemo, useState } from "react";
import { LogOut, BookOpen } from "lucide-react";
import TestConfirmDialog from "./TestConfirmDialog";
import TestTimer from "./TestTimer";
import QuestionDisplay from "./QuestionDisplay";
import QuestionGrid from "./QuestionGrid";
import SubmitDialog from "./SubmitDialog";
import TestCompletedDialog from "./TestCompletedDialog";

import {
 
  SECTIONS,
  QUESTIONS_PER_SECTION,
} from "../constants/TestData";
import { getQuestionsByTestId } from "../lib/questionApi";
import { Question as BaseQuestion, StudentAnswer, Test } from "../lib/Interface";
import { getTestById } from "@/lib/testApi";

type Question = BaseQuestion & { question_number: number };

export default function AttemptClient() {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get("testid");
  //   const { student } = useAuth();

  const [test, setTest] = useState<Test>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);


  const [studentAnswers, setStudentAnswers] = useState<{
    [key: string]: StudentAnswer;
  }>({});

  const [showConfirmDialog, setShowConfirmDialog] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showCompletedDialog, setShowCompletedDialog] = useState(false);
  const [completionReason, setCompletionReason] = useState<
    "submitted" | "timeout"
  >("submitted");

  const [currentSection, setCurrentSection] = useState<(typeof SECTIONS)[number]>("PHYSICS");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const sectionWiseQuestions = useMemo(() => {
    const map: Record<string, Question[]> = {};

    questions.forEach(q => {
      if (!map[q.section]) {
        map[q.section] = [];  // initialize if missing
      }
      map[q.section].push(q);
    });

    return map;
  }, [questions]);


  useEffect(() => {
    const fetchQuestions = async () => {
      if (!testId) return;
      setLoading(true);
      try {
        const data = await getQuestionsByTestId(testId);
        // Assign question_number per section if not present
        const questionsWithNumber: Question[] = [];

        data.forEach((q: any, idx: number) => {
          questionsWithNumber.push({ ...q, question_number: idx + 1 });
        });

        setQuestions(questionsWithNumber);
        console.log("Fetched questions:", questionsWithNumber);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchTestDetails = async () => {
      if (!testId) return;
      setLoading(true);
      try {
        const data = await getTestById(testId);
        setTest(data);
        console.log("Fetched test details:", data);
      } catch (err) {
        console.error("Failed to fetch test details:", err);
      }
    };
    fetchTestDetails();
    fetchQuestions();
  }, [testId]);

  const handleStartTest = () => {
    setTestStarted(true);
    setLoading(false);
    setShowConfirmDialog(false);
  };

  const handleAnswerChange = (
    selectedOptionId: string | null,
    integerValue?: number
  ) => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion || !testStarted) return;

    const key = currentQuestion.questionId ?? currentQuestion.id;
    if (!key) return;

    const updatedAnswer: StudentAnswer = {
      question_id: key,
      selected_option_id: selectedOptionId,
      integer_answer: integerValue,
      is_answered:
        selectedOptionId !== null || integerValue !== undefined,
      answered_at: new Date().toISOString(),
    };

    setStudentAnswers((prev) => ({
      ...prev,
      [key]: updatedAnswer,
    }));
  };


  const handleTimeUp = () => {
    handleSubmitTest();
    setCompletionReason("timeout");
    setShowCompletedDialog(true);
  };

  const handleSubmitTest = () => {
    setShowSubmitDialog(false);
    setShowCompletedDialog(true);
    setCompletionReason("submitted");
  };

  const getCurrentQuestion = () => {
    const list = sectionWiseQuestions[currentSection];
    return list ? list[currentQuestionIndex] : null;
  };

  const getQuestionPosition = () => {
    const sectionIndex = SECTIONS.indexOf(currentSection);
    return sectionIndex * QUESTIONS_PER_SECTION + currentQuestionIndex + 1;
  };

  const getAnsweredCount = () => {
    return Object.values(studentAnswers).filter((a) => a.is_answered).length;
  };

  const getQuestionIds = () => {
    const result: Record<string, string[]> = {};

    SECTIONS.forEach((section) => {
      result[section] = questions
        .filter((q) => q.section === section)
        .sort((a, b) => a.question_number - b.question_number)
        .map((q) => q.id)
        .filter((id): id is string => Boolean(id));  // <-- FIX
    });

    return result;
  };

  if (loading) {
    return (
      <div className="min-h-screen from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <p className="text-gray-700 text-lg">Test not found</p>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();

  console.log("Current Question:", currentQuestion);

  if (showConfirmDialog && !testStarted) {
    return (
      <TestConfirmDialog
        testName={test.testName || ""}
        duration={Math.ceil((test.durationInMins || 60) / 60)}
        totalQuestions={test.totalQuestions || 0}
        onConfirm={handleStartTest}
        onCancel={() => navigate.push("/dashboard")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{test.description}</h1>
              {/* <p className="text-sm text-gray-600">{student?.full_name}</p> */}
              <p className="text-sm text-gray-600">John</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <TestTimer
              durationMinutes={test.durationInMins || 60}
              onTimeUp={handleTimeUp}
              isActive={testStarted}
            />
            <button
              onClick={() => navigate.push("/dashboard")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>End Test</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
              {currentQuestion ? (
                <QuestionDisplay
                  question={currentQuestion}
                  currentAnswer={
                    studentAnswers[
                    currentQuestion.questionId ??
                    currentQuestion.id ??
                    ""
                    ]
                  }
                  onAnswerChange={handleAnswerChange}
                  onPrevious={() => {
                    if (currentQuestionIndex > 0) {
                      setCurrentQuestionIndex(currentQuestionIndex - 1);
                    } else {
                      const currentSectionIdx = SECTIONS.indexOf(currentSection);
                      if (currentSectionIdx > 0) {
                        const prevSection = SECTIONS[currentSectionIdx - 1];
                        const list = sectionWiseQuestions[prevSection];
                        setCurrentSection(prevSection);
                        setCurrentQuestionIndex(list.length - 1);
                      }
                    }
                  }}

                  onNext={() => {
                    const list = sectionWiseQuestions[currentSection];
                    if (currentQuestionIndex < list.length - 1) {
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                    } else {
                      const currentSectionIdx = SECTIONS.indexOf(currentSection);
                      if (currentSectionIdx < SECTIONS.length - 1) {
                        const nextSection = SECTIONS[currentSectionIdx + 1];
                        setCurrentSection(nextSection);
                        setCurrentQuestionIndex(0);
                      }
                    }
                  }}

                  hasPrevious={
                    currentQuestionIndex > 0 ||
                    SECTIONS.indexOf(currentSection) > 0
                  }
                  hasNext={
                    currentQuestionIndex < QUESTIONS_PER_SECTION - 1 ||
                    SECTIONS.indexOf(currentSection) < SECTIONS.length - 1
                  }
                  questionPosition={`${getQuestionPosition()}/${SECTIONS.length * QUESTIONS_PER_SECTION
                    }`}
                />
              ) : (
                <div className="flex items-center justify-center h-96">
                  <p className="text-gray-600">
                    Internal Server Error question...
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-bold text-gray-900 mb-3">Sections</h3>
                <div className="grid grid-cols-2 gap-2">
                  {SECTIONS.map((section) => (
                    <button
                      key={section}
                      onClick={() => {
                        setCurrentSection(section);
                        setCurrentQuestionIndex(0);
                      }}
                      className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${currentSection === section
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {section.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <QuestionGrid
                sections={SECTIONS}
                questionsPerSection={QUESTIONS_PER_SECTION}
                answeredQuestions={
                  new Set(
                    Object.keys(studentAnswers).filter(
                      (k) => studentAnswers[k].is_answered
                    )
                  )
                }
                currentQuestionId={currentQuestion?.id || ""}
                onQuestionSelect={(questionId) => {
                  const q = questions.find((que) => que.id === questionId);
                  if (q && typeof q.question_number === "number") {
                    setCurrentSection(q.section);
                    setCurrentQuestionIndex(q.question_number - 1);
                  }
                }}
                questionIds={getQuestionIds()}
              />

              <button
                onClick={() => setShowSubmitDialog(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-green-500/30"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </main>

      {showSubmitDialog && (
        <SubmitDialog
          answeredCount={getAnsweredCount()}
          totalCount={SECTIONS.length * QUESTIONS_PER_SECTION}
          onConfirm={async () => {
            await handleSubmitTest();
            setShowSubmitDialog(false);
            setCompletionReason("submitted");
            setShowCompletedDialog(true);
          }}
          onCancel={() => setShowSubmitDialog(false)}
        />
      )}

      {showCompletedDialog && (
        <TestCompletedDialog
          answeredCount={getAnsweredCount()}
          totalCount={SECTIONS.length * QUESTIONS_PER_SECTION}
          reason={completionReason}
          onGoToDashboard={() => navigate.push("/dashboard")}
        />
      )}
    </div>
  );
}