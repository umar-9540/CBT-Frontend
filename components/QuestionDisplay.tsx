import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Question, StudentAnswer } from "../lib/Interface";

interface Props {
  question: Question;
  currentAnswer: StudentAnswer | undefined;
  onAnswerChange: (selectedOptionId: string | null, integerAnswer?: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  questionPosition: string;
}
export default function QuestionDisplay({
  question,
  currentAnswer,
  onAnswerChange,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  questionPosition,
}: Props) {
  if (!question) return null;

  const {
    stem,
    section,
    marks,
    type,
    options = [],
    attachments = [],
  } = question;

  const normalizedAttachments = attachments.map(att =>
    typeof att === "string" ? { url: att, type: "image" } : att
  );

  const selectedAnswer =
    type === "MCQ"
      ? currentAnswer?.selected_option_id || ""
      : currentAnswer?.integer_answer?.toString() || "";

  const handleIntegerChange = (value:any) => {
    if (value === "") return onAnswerChange(null, undefined);
    const intVal = parseInt(value);
    if (!isNaN(intVal)) onAnswerChange(null, intVal);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow">
      {/* HEADER */}
      <div className="border-b border-gray-200 px-6 py-4 bg-gray-50 rounded-t-xl">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 tracking-wide">
              {section} • Question {questionPosition}
            </p>
            <h2 className="text-xl font-semibold text-gray-900 mt-1">
              Question
            </h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Marks</p>
            <p className="text-3xl font-bold text-blue-600">{marks}</p>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Question text */}
        <p className="text-lg font-semibold text-gray-900 leading-relaxed">
          {stem}
        </p>

        {/* Attachments */}
        {normalizedAttachments.length > 0 && (
          <div className="space-y-3">
            {normalizedAttachments.map((att) => (
              <div key={att.url} className="rounded-lg overflow-hidden">
                <Image
                  src={att.url}
                  alt="Question attachment"
                  width={700}
                  height={400}
                  className="rounded-xl object-contain bg-gray-100 p-2"
                />
              </div>
            ))}
          </div>
        )}

        {/* Options / Integer box */}
        {type === "MCQ" ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Select the correct option:
            </p>

            {options.map((op) => (
              <label
                key={op.optionId}
                className={`block p-4 rounded-xl border transition-all cursor-pointer
                  ${selectedAnswer === op.optionId
                    ? "border-blue-600 bg-blue-50 shadow"
                    : "border-gray-300 bg-white hover:border-blue-300"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    checked={selectedAnswer === op.optionId}
                    onChange={() => onAnswerChange(op.optionId)}
                    className="mt-1 w-5 h-5 text-blue-600 cursor-pointer"
                  />
                  <div>
                    <p className="text-gray-900 font-medium">{op.text}</p>
                    {op.image && (
                      <img
                        src={op.image}
                        alt="Option"
                        className="mt-2 h-32 rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-gray-700">
              Enter your answer:
            </p>
            <input
              value={selectedAnswer}
              onChange={(e) => handleIntegerChange(e.target.value)}
              placeholder="Enter value"
              className="mt-2 w-full px-4 py-3 border rounded-xl text-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        )}
      </div>

      {/* FOOTER BUTTONS */}
      <div className="border-t border-gray-200 p-4 flex gap-3 bg-gray-50 rounded-b-xl">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg font-medium 
          disabled:opacity-40 bg-white hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg font-medium 
          disabled:opacity-40 bg-white hover:bg-gray-100"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
