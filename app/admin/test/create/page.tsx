"use client";
import { useState } from "react";
import { createTest } from "@/lib/testApi";
import { useRouter } from "next/navigation";

export default function CreateTestPage() {
    // Special handler for startAt date
    const handleStartDateChange = (e: any) => {
      const dateStr = e.target.value;
      setForm(f => ({
        ...f,
        startAt: dateStr
      }));
    };
  const router = useRouter();
  const [form, setForm] = useState({
    testName: "",
    totalQuestions: "",
    durationInMins: "",
    maxMarks: "",
    passingMarks: "",
    active: true,
    shuffleQuestions: false,
    sections: [],
    negativeMarking: { enabled: false, perWrong: 0 },
    expireAt: "",
    startAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Special handler for expireAt date
  const handleExpireDateChange = (e: any) => {
    const dateStr = e.target.value;
    setForm(f => ({
      ...f,
      expireAt: dateStr
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Convert startAt and expireAt to milliseconds if set
      const payload = {
        ...form,
        startAt: form.startAt ? new Date(form.startAt).getTime() : "",
        expireAt: form.expireAt ? new Date(form.expireAt).getTime() : ""
      };
      await createTest(payload);
      router.push("/admin/test");
    } catch {
      setError("Failed to create test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Test</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block font-medium mb-1">Start Date & Time</label>
                <input
                  name="startAt"
                  type="datetime-local"
                  value={form.startAt}
                  onChange={handleStartDateChange}
                  className="w-full p-2 border rounded"
                />
        <label className="block font-medium mb-1">Test Name</label>
        <input name="testName" value={form.testName} onChange={handleChange} placeholder="Test Name" className="w-full p-2 border rounded" required />

        <label className="block font-medium mb-1">Total Questions</label>
        <input name="totalQuestions" value={form.totalQuestions} onChange={handleChange} placeholder="Total Questions" className="w-full p-2 border rounded" required />

        <label className="block font-medium mb-1">Duration (mins)</label>
        <input name="durationInMins" type="number" value={form.durationInMins} onChange={handleChange} placeholder="Duration (mins)" className="w-full p-2 border rounded" required />

        <label className="block font-medium mb-1">Max Marks</label>
        <input name="maxMarks" type="number" value={form.maxMarks} onChange={handleChange} placeholder="Max Marks" className="w-full p-2 border rounded" required />

        <label className="block font-medium mb-1">Passing Marks</label>
        <input name="passingMarks" type="number" value={form.passingMarks} onChange={handleChange} placeholder="Passing Marks" className="w-full p-2 border rounded" required />

       
        <label className="flex items-center gap-2">
          <input name="active" type="checkbox" checked={form.active} onChange={handleChange} />
          <span>Active</span>
        </label>

        <label className="flex items-center gap-2">
          <input name="shuffleQuestions" type="checkbox" checked={form.shuffleQuestions} onChange={handleChange} />
          <span>Shuffle Questions</span>
        </label>

        {/* Expire Date with calendar and time */}
        <label className="block font-medium mb-1">Expire Date & Time</label>
        <input
          name="expireAt"
          type="datetime-local"
          value={form.expireAt}
          onChange={handleExpireDateChange}
          className="w-full p-2 border rounded"
        />
        

        {/* Add section and negative marking UI as needed */}
        <button type="submit" disabled={loading} className="w-full p-2 bg-blue-600 text-white rounded">
          {loading ? "Creating..." : "Create Test"}
        </button>
      </form>
    </div>
  );
}
