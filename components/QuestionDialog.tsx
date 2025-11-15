"use client";

import { useState } from "react";
import { Question, Test } from "@/lib/Interface";
import QuestionForm from "./QuestionForm";
import { X } from "lucide-react";

interface QuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Question;
  onSubmit: (data: Omit<Question, "id" | "questionId">) => Promise<void>;
  tests?: Array<Test>;
  title?: string;
}

export default function QuestionDialog({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  tests = [],
  title,
}: QuestionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Omit<Question, "id" | "questionId">) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between bg-linear-to-r from-blue-600 to-blue-700 text-white p-6 border-b">
          <h2 className="text-xl font-bold">
            {title || (initialData ? "Edit Question" : "Create New Question")}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 p-1 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <QuestionForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            tests={tests}
          />
        </div>
      </div>
    </div>
  );
}
