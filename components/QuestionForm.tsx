"use client";

import { useState } from "react";
import { Question, Option, CorrectAnswer, Section, Type, Test } from "@/lib/Interface";
import { X, Plus, Trash2 } from "lucide-react";

interface QuestionFormProps {
  initialData?: Question;
  onSubmit: (data: Omit<Question, "id" | "questionId">) => Promise<void>;
  isLoading?: boolean;
  tests?: Array<Test>;
}

export default function QuestionForm({
  initialData,
  onSubmit,
  isLoading = false,
  tests = [],
}: QuestionFormProps) {
  const [formData, setFormData] = useState<Omit<Question, "id" | "questionId">>(
    initialData || {
      testId: "",
      section: "PHYSICS" as unknown as Section,
      type: "MCQ" as Type,
      stem: "",
      marks: 4,
      negativeMarks: -1,
      options: [],
      attachments: [],
      tolerance: 0,
      correctAnswer: {
        answer: "",
        explanation: "",
        attachments: [],
      },
    }
  );

  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "marks" ||
        name === "tolerance" ||
        name === "negativeMarks"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  // CorrectAnswer handlers
  const handleCorrectAnswerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      correctAnswer: {
        ...prev.correctAnswer,
        [name]: value,
      },
    }));
  };

  const [correctAttachmentUrl, setCorrectAttachmentUrl] = useState("");
  const handleAddCorrectAttachment = () => {
    if (correctAttachmentUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        correctAnswer: {
          ...prev.correctAnswer,
          attachments: [...(prev.correctAnswer.attachments || []), correctAttachmentUrl],
        },
      }));
      setCorrectAttachmentUrl("");
    }
  };
  const handleRemoveCorrectAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      correctAnswer: {
        ...prev.correctAnswer,
        attachments: (prev.correctAnswer.attachments || []).filter((_, i) => i !== index),
      },
    }));
  };

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...(prev.options || []),
        {
          optionId: `O-${Date.now()}`,
          text: "",
          image: "",
        },
      ],
    }));
  };

  const handleRemoveOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: (prev.options || []).filter((_, i) => i !== index),
    }));
  };

  const handleOptionChange = (
    index: number,
    field: "text" | "image",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      options: (prev.options || []).map((opt, i) =>
        i === index ? { ...opt, [field]: value } : opt
      ),
    }));
  };

  // Select correct answer for MCQ
  const handleSelectCorrectOption = (optionId: string) => {
    setFormData((prev) => ({
      ...prev,
      correctAnswer: {
        ...prev.correctAnswer,
        answer: optionId,
      },
    }));
  };

  const handleAddAttachment = () => {
    if (attachmentUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...(prev.attachments || []), attachmentUrl],
      }));
      setAttachmentUrl("");
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.testId) {
      setError("Please select a test");
      return;
    }
    if (!formData.section) {
      setError("Please select a section");
      return;
    }
    if (!formData.stem.trim()) {
      setError("Please enter a question stem");
      return;
    }
    if (formData.type === "MCQ" && (!formData.options || formData.options.length < 2)) {
      setError("MCQ questions must have at least 2 options");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || "Failed to save question");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Test Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Test *
        </label>
        <select
          name="testId"
          value={formData.testId}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select a test</option>
          {tests.map((test) => (
            <option key={test.testId} value={test.testId}>
              {test.testName || test.testId}
            </option>
          ))}
        </select>
      </div>

      {/* Section (enum) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Section *
        </label>
        <select
          name="section"
          value={formData.section as unknown as string}
          onChange={e => setFormData(prev => ({ ...prev, section: e.target.value as unknown as Section }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="PHYSICS">PHYSICS</option>
          <option value="CHEMISTRY">CHEMISTRY</option>
          <option value="MATHS">MATHS</option>
        </select>
      </div>

      {/* Question Type (enum) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Type *
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="MCQ">Multiple Choice (MCQ)</option>
          <option value="INTEGER">Integer Type</option>
        </select>
      </div>

      {/* Question Stem */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Stem *
        </label>
        <textarea
          name="stem"
          value={formData.stem}
          onChange={handleChange}
          placeholder="Enter the question text..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Attachments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachments (Images/Documents)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="url"
            value={attachmentUrl}
            onChange={(e) => setAttachmentUrl(e.target.value)}
            placeholder="Enter image/document URL..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddAttachment}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {(formData.attachments || []).map((url, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate text-sm"
              >
                {url}
              </a>
              <button
                type="button"
                onClick={() => handleRemoveAttachment(idx)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MCQ Options */}
      {formData.type === "MCQ" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options *
          </label>
          <div className="space-y-3">
            {(formData.options || []).map((option, idx) => (
              <div key={option.optionId} className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(idx, "text", e.target.value)
                    }
                    placeholder={`Option ${idx + 1}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    value={option.image || ""}
                    onChange={(e) =>
                      handleOptionChange(idx, "image", e.target.value)
                    }
                    placeholder="Option image URL (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveOption(idx)}
                  className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Option
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddOption}
            className="mt-3 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Option
          </button>

          {/* Correct Answer Bar for MCQ */}
          {(formData.options?.length ?? 0) > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Correct Answer
              </label>
              <div className="flex gap-2 overflow-x-auto">
                {(formData.options ?? []).map((option, idx) => (
                  <button
                    key={option.optionId}
                    type="button"
                    onClick={() => handleSelectCorrectOption(option.optionId)}
                    className={`px-4 py-2 rounded-lg font-medium border transition-colors duration-150 ${formData.correctAnswer?.answer === option.optionId
                      ? "bg-green-500 text-white border-green-600"
                      : "bg-gray-200 text-gray-700 border-gray-300"}`}
                  >
                    { `Option ${idx + 1}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scoring */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marks *
          </label>
          <input
            type="number"
            name="marks"
            value={formData.marks}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Negative Marks *
          </label>
          <input
            type="number"
            name="negativeMarks"
            value={formData.negativeMarks}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {formData.type === "INTEGER" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tolerance
            </label>
            <input
              type="number"
              name="tolerance"
              value={formData.tolerance || 0}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Correct Answer */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correct Answer
        </label>
        {/* For INTEGER type, allow manual input. For MCQ, answer is selected above. */}
        {formData.type === "INTEGER" && (
          <input
            type="text"
            name="answer"
            value={formData.correctAnswer?.answer || ""}
            onChange={handleCorrectAnswerChange}
            placeholder="Enter correct answer value"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
        )}
        <textarea
          name="explanation"
          value={formData.correctAnswer?.explanation || ""}
          onChange={handleCorrectAnswerChange}
          placeholder="Explanation (optional)"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
        <div className="flex gap-2 mb-2">
          <input
            type="url"
            value={correctAttachmentUrl}
            onChange={(e) => setCorrectAttachmentUrl(e.target.value)}
            placeholder="Enter attachment URL..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddCorrectAttachment}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {(formData.correctAnswer?.attachments || []).map((url, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate text-sm"
              >
                {url}
              </a>
              <button
                type="button"
                onClick={() => handleRemoveCorrectAttachment(idx)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? "Saving..." : initialData ? "Update Question" : "Create Question"}
        </button>
      </div>
    </form>
  );
}
