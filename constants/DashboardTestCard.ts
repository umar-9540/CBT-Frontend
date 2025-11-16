import { Test, TestAttempt } from "../lib/Interface";

export const testsResult: Test[] = [
];

export const attemptsResult: TestAttempt[] = [
  {
    id: "e1d2a3b4-c5d6-4e7f-8a91-b2c3d4e5f678",
    student_id: "a11fbc45-6789-4321-9abc-def012345678",
    test_id: "1f6eaa8c-3c2f-4d91-a3cd-5a8e7a12b912", // JavaScript Fundamentals Test
    score: 85,
    attempted_date: "2025-11-06T11:00:00Z",
    completed: true,
    created_at: "2025-11-06T11:00:00Z",
  },
  {
    id: "b2c3d4e5-f6a7-489b-9c01-d2e3f4a5b6c7",
    student_id: "b22fcd56-1234-5678-9def-abcdef012345",
    test_id: "8d2f7a6a-bf72-46b2-92e1-4dc6b828f192", // ReactJS Advanced Concepts
    score: 97,
    attempted_date: "2025-11-07T15:30:00Z",
    completed: true,
    created_at: "2025-11-07T15:30:00Z",
  },
  {
    id: "c3d4e5f6-a7b8-4c9d-0e12-f3a4b5c6d7e8",
    student_id: "c33fed67-4321-9876-abcd-1234567890ab",
    test_id: "bb9c1c65-97f0-4f41-bd07-4b4519ab7d11", // Node.js & Express Backend Test
    score: 72,
    attempted_date: "2025-11-08T10:15:00Z",
    completed: false,
    created_at: "2025-11-08T10:15:00Z",
  },
];
