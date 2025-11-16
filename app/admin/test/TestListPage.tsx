"use client";
import { useEffect, useState } from "react";
import { getTests, deleteTest } from "@/lib/testApi";
import Link from "next/link";

interface Section {
  name: string;
  count: number;
  mcqType: number;
  integerType: number;
}

interface NegativeMarking {
  enabled: boolean;
  perWrong: number;
}

interface Test {
  id: string;
  testId: string;
  testName: string;
  totalQuestions: string;
  sections: Section[];
  negativeMarking: NegativeMarking;
  durationInMins: number;
  maxMarks: number;
  passingMarks: number;
  active: boolean;
  shuffleQuestions: boolean;
  createdAt: number;
  postedAt: number;
  expireAt: number;
}

export default function TestListPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getTests()
      .then(data => setTests(data))
      .catch(() => setError("Failed to fetch tests"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (testId: string) => {
    if (!confirm("Delete this test?")) return;
    setLoading(true);
    try {
      await deleteTest(testId);
      setTests(tests.filter(t => t.testId !== testId));
    } catch {
      setError("Failed to delete test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test List</h1>
      <Link href="/admin/test/create" className="mb-4 inline-block px-4 py-2 bg-blue-600 text-white rounded">Create Test</Link>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Test Name</th>
            <th className="p-2">Total Questions</th>
            <th className="p-2">Duration</th>
            <th className="p-2">Max Marks</th>
            <th className="p-2">Active</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map(test => (
            <tr key={test.testId} className="border-t">
              <td className="p-2">{test.testName}</td>
              <td className="p-2">{test.totalQuestions}</td>
              <td className="p-2">{test.durationInMins} min</td>
              <td className="p-2">{test.maxMarks}</td>
              <td className="p-2">{test.active ? "Yes" : "No"}</td>
              <td className="p-2 flex gap-2">
                <Link href={`/admin/test/detail?testId=${test.testId}`}
                  className="px-2 py-1 bg-green-600 text-white rounded">View</Link>
                <button onClick={() => handleDelete(test.testId)}
                  className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
