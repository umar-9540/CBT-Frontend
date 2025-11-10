import { CheckCircle2, Circle } from "lucide-react";

interface QuestionGridProps {
  sections: string[];
  questionsPerSection: number;
  answeredQuestions: Set<string>;
  currentQuestionId: string;
  onQuestionSelect: (questionId: string) => void;
  questionIds: { [key: string]: string[] };
}

export default function QuestionGrid({
  sections,
  questionsPerSection,
  answeredQuestions,
  currentQuestionId,
  onQuestionSelect,
  questionIds,
}: QuestionGridProps) {
  return (
    <div className="bg-white rounded-lg shadow-md h-full flex flex-col overflow-hidden">
      <div className="bg-linear-to-r from-blue-600 to-blue-500 text-white p-4">
        <h3 className="font-bold text-lg">Questions Overview</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sections.map((section) => (
          <div key={section}>
            <h4 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">
              {section}
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: questionsPerSection }).map((_, index) => {
                const qNum = index + 1;
                const qId = questionIds[section]?.[index] || "";
                const isAnswered = answeredQuestions.has(qId);
                const isCurrent = currentQuestionId === qId;

                return (
                  <button
                    key={`${section}-${qNum}`}
                    onClick={() => onQuestionSelect(qId)}
                    className={`aspect-square rounded-lg font-semibold text-sm transition-all transform hover:scale-105 flex items-center justify-center relative ${
                      isCurrent
                        ? "ring-2 ring-offset-2 ring-blue-600 bg-blue-600 text-white shadow-lg"
                        : isAnswered
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title={`Q${qNum}`}
                  >
                    {isCurrent && (
                      <div className="absolute inset-0 rounded-lg ring-2 ring-white"></div>
                    )}
                    <span className="z-10">{qNum}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <Circle className="w-4 h-4 fill-gray-300 text-gray-300" />
            <span className="text-gray-600">Not Answered</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">Answered</span>
          </div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-900">
            Answered: {answeredQuestions.size} /{" "}
            {sections.length * questionsPerSection}
          </p>
        </div>
      </div>
    </div>
  );
}
