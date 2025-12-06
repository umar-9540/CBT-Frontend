import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LogOut, BookOpen } from "lucide-react";
// import { useAuth } from "../contexts/AuthContext";
import TestConfirmDialog from "../../../../components/TestConfirmDialog";
import TestTimer from "../../../../components/TestTimer";
import QuestionDisplay from "../../../../components/QuestionDisplay";
import QuestionGrid from "../../../../components/QuestionGrid";
import SubmitDialog from "../../../../components/SubmitDialog";
import TestCompletedDialog from "../../../../components/TestCompletedDialog";

import {
  TEST,
  QUESTIONS,
  QUESTION_OPTIONS,
  ATTACHMENTS,
  SECTIONS,
  QUESTIONS_PER_SECTION,
} from "../../../../constants/TestData";

export default function TestPage() {
  const navigate = useNavigate();
  // const { testId } = useParams<{ testId: string }>();
  //   const { student } = useAuth();

  const [test] = useState(TEST);
  const [questions] = useState(QUESTIONS);
  const [questionOptions] = useState(QUESTION_OPTIONS);
  const [attachments] = useState(ATTACHMENTS);
  const [loading, setLoading] = useState(true);
  type StudentAnswer = {
    question_id: string;
    selected_option_id: string | null;
    integer_answer?: number;
    is_answered: boolean;
    answered_at: string;
  };

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

  const [currentSection, setCurrentSection] = useState("Physics");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

    const updatedAnswer = {
      question_id: currentQuestion.id,
      selected_option_id: selectedOptionId,
      integer_answer: integerValue,
      is_answered: selectedOptionId !== null || integerValue !== undefined,
      answered_at: new Date().toISOString(),
    };

    setStudentAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: updatedAnswer,
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
    return questions.find(
      (q) =>
        q.section === currentSection &&
        q.question_number === currentQuestionIndex + 1
    );
  };

  const getQuestionPosition = () => {
    const sectionIndex = SECTIONS.indexOf(currentSection);
    return sectionIndex * QUESTIONS_PER_SECTION + currentQuestionIndex + 1;
  };

  const getAnsweredCount = () => {
    return Object.values(studentAnswers).filter((a) => a.is_answered).length;
  };

  const getQuestionIds = () => {
    const result: { [key: string]: string[] } = {};
    SECTIONS.forEach((section) => {
      result[section] = questions
        .filter((q) => q.section === section)
        .sort((a, b) => a.question_number - b.question_number)
        .map((q) => q.id);
    });
    return result;
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
  //     </div>
  //   );
  // }

  if (!test) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <p className="text-gray-700 text-lg">Test not found</p>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();

  if (showConfirmDialog && !testStarted) {
    return (
      <TestConfirmDialog
        testName={test.title}
        duration={Math.ceil(test.duration / 60)}
        totalQuestions={SECTIONS.length * QUESTIONS_PER_SECTION}
        onConfirm={handleStartTest}
        onCancel={() => navigate("/dashboard")}
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
              <h1 className="text-lg font-bold text-gray-900">{test.title}</h1>
              {/* <p className="text-sm text-gray-600">{student?.full_name}</p> */}
              <p className="text-sm text-gray-600">John</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <TestTimer
              durationMinutes={test.duration}
              onTimeUp={handleTimeUp}
              isActive={testStarted}
            />
            <button
              onClick={() => navigate("/dashboard")}
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
                  options={questionOptions[currentQuestion.id] || []}
                  attachments={attachments[currentQuestion.id] || []}
                  currentAnswer={studentAnswers[currentQuestion.id]}
                  onAnswerChange={handleAnswerChange}
                  onPrevious={() => {
                    if (currentQuestionIndex > 0) {
                      setCurrentQuestionIndex(currentQuestionIndex - 1);
                    } else if (SECTIONS.indexOf(currentSection) > 0) {
                      const prevSection =
                        SECTIONS[SECTIONS.indexOf(currentSection) - 1];
                      setCurrentSection(prevSection);
                      setCurrentQuestionIndex(QUESTIONS_PER_SECTION - 1);
                    }
                  }}
                  onNext={() => {
                    if (currentQuestionIndex < QUESTIONS_PER_SECTION - 1) {
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                    } else if (
                      SECTIONS.indexOf(currentSection) <
                      SECTIONS.length - 1
                    ) {
                      const nextSection =
                        SECTIONS[SECTIONS.indexOf(currentSection) + 1];
                      setCurrentSection(nextSection);
                      setCurrentQuestionIndex(0);
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
                  questionPosition={`${getQuestionPosition()}/${
                    SECTIONS.length * QUESTIONS_PER_SECTION
                  }`}
                />
              ) : (
                <div className="flex items-center justify-center h-96">
                  <p className="text-gray-600">Loading question...</p>
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
                      className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                        currentSection === section
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
                  if (q) {
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
          onGoToDashboard={() => navigate("/dashboard")}
        />
      )}
    </div>
  );
}
