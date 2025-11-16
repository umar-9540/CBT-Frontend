import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Question,
  QuestionOption,
  QuestionAttachment,
  StudentAnswer,
} from "../lib/Interface";
import Image from "next/image";

interface QuestionDisplayProps {
  question: Question;
  options: QuestionOption[];
  attachments: QuestionAttachment[];
  currentAnswer?: StudentAnswer;
  onAnswerChange: (answerId: string | null, integerValue?: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  questionPosition: string;
}

export default function QuestionDisplay({
  question,
  options,
  attachments,
  currentAnswer,
  onAnswerChange,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  questionPosition,
}: QuestionDisplayProps) {
  const handleIntegerChange = (value: string) => {
    if (value === "") {
      onAnswerChange(null, undefined);
    } else {
      const intValue = parseInt(value);
      if (!isNaN(intValue)) {
        onAnswerChange(null, intValue);
      }
    }
  };

  const getSelectedAnswer = () => {
    if (question.type === "MCQ") {
      return currentAnswer?.selected_option_id || "";
    } else {
      return currentAnswer?.integer_answer?.toString() || "";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              {question.section} • Question {questionPosition}
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              Question 
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Marks</p>
            <p className="text-2xl font-bold text-blue-600">{question.marks}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div>
            <p className="text-lg font-semibold text-gray-900 leading-relaxed mb-4">
              {question.stem}
            </p>

            {attachments.length > 0 && (
              <div className="space-y-4 mb-6">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.url}
                    className="bg-gray-50 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={attachment.url}
                      alt="Question attachment"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {question.type === "MCQ" ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700 mb-4">
                Select the correct option:
              </p>
              {options.map((option) => (
                <label
                  key={option.optionId}
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    getSelectedAnswer() === option.optionId
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.optionId}
                      checked={getSelectedAnswer() === option.optionId}
                      onChange={(e) => onAnswerChange(e.target.value)}
                      className="mt-1 w-5 h-5 text-blue-600 cursor-pointer"
                    />
                    {/* <div className="flex-1">
                      {option.option_text && (
                        <p className="text-gray-900 font-medium">
                          {option.option_text}
                        </p>
                      )}
                      {option.option_image && (
                        <img
                          src={option.option_image}
                          alt={`Option ${option.order}`}
                          className="mt-2 max-h-48 rounded-lg"
                        />
                      )}
                    </div> */}
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-4">
                Enter your answer:
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="string"
                  value={getSelectedAnswer()}
                  onChange={(e) => handleIntegerChange(e.target.value)}
                  placeholder="Enter your answer"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg font-semibold"
                />
                {/* <span className="text-gray-600 font-medium">
                  {question.tolerance > 0 && `(±${question.tolerance})`}
                </span> */}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-6 flex gap-3">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <span>Next</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
