import { CheckCircle, Home } from "lucide-react";

interface TestCompletedDialogProps {
  answeredCount: number;
  totalCount: number;
  reason: "submitted" | "timeout";
  onGoToDashboard: () => void;
}

export default function TestCompletedDialog({
  answeredCount,
  totalCount,
  reason,
  onGoToDashboard,
}: TestCompletedDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-scale-in">
        <div className="p-6 text-center border-b border-gray-200 bg-linear-to-r from-green-50 to-green-100">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-4 rounded-full">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {reason === "timeout" ? "Time's Up!" : "Test Submitted"}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-linear-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-gray-600 mb-2">Questions Answered</p>
            <p className="text-3xl font-bold text-blue-600">
              {answeredCount}/{totalCount}
            </p>
          </div>

          <div className="text-center">
            {reason === "timeout" ? (
              <p className="text-gray-700">
                Your test has been automatically submitted due to time
                expiration. Your answers have been saved.
              </p>
            ) : (
              <p className="text-gray-700">
                Your test has been successfully submitted. You can view your
                results on the dashboard.
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">Note:</span> Results will be
              evaluated and displayed in your dashboard within 24 hours.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onGoToDashboard}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
