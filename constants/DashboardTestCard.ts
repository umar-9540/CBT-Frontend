import { Test, TestAttempt } from "../lib/Interface";

export const testsResult: Test[] = [
  {
    id: "test001",
    name: "JavaScript Fundamentals Test",
    description:
      "Assess your understanding of JavaScript basics including variables, functions, and ES6 features.",
    posted_date: "2025-11-01T10:00:00Z",
    start_date: "2025-11-05T09:00:00Z",
    end_date: "2025-11-10T23:59:00Z",
    duration_minutes: 45,
    total_marks: 100,
    is_active: true,
    created_at: "2025-11-01T10:00:00Z",
  },
  {
    id: "test001",
    name: "ReactJS Advanced Concepts",
    description:
      "Covers hooks, context API, state management, and performance optimization in React.",
    posted_date: "2025-10-28T12:00:00Z",
    start_date: "2025-11-02T09:00:00Z",
    end_date: "2025-11-08T23:59:00Z",
    duration_minutes: 60,
    total_marks: 120,
    is_active: true,
    created_at: "2025-10-28T12:00:00Z",
  },
  {
    id: "test001",
    name: "Data Structures & Algorithms Test",
    description:
      "Evaluate your skills in arrays, linked lists, trees, graphs, and time complexity analysis.",
    posted_date: "2025-10-15T15:00:00Z",
    start_date: "2025-10-20T09:00:00Z",
    end_date: "2025-11-01T23:59:00Z",
    duration_minutes: 90,
    total_marks: 150,
    is_active: false,
    created_at: "2025-10-15T15:00:00Z",
  },
  {
    id: "test001",
    name: "Node.js & Express Backend Test",
    description:
      "Test your understanding of REST APIs, middleware, authentication, and async programming.",
    posted_date: "2025-11-03T09:00:00Z",
    start_date: "2025-11-06T09:00:00Z",
    end_date: "2025-11-12T23:59:00Z",
    duration_minutes: 75,
    total_marks: 120,
    is_active: true,
    created_at: "2025-11-03T09:00:00Z",
  },
  {
    id: "test001",
    name: "Database Design & SQL Test",
    description:
      "Focuses on relational schema design, normalization, joins, and query optimization.",
    posted_date: "2025-10-25T11:00:00Z",
    start_date: "2025-10-28T09:00:00Z",
    end_date: "2025-11-05T23:59:00Z",
    duration_minutes: 60,
    total_marks: 100,
    is_active: false,
    created_at: "2025-10-25T11:00:00Z",
  },
  {
    id: "test001",
    name: "Frontend System Design Challenge",
    description:
      "Evaluate your ability to architect scalable UI systems and component-based designs.",
    posted_date: "2025-11-06T10:30:00Z",
    start_date: "2025-11-08T09:00:00Z",
    end_date: "2025-11-15T23:59:00Z",
    duration_minutes: 90,
    total_marks: 150,
    is_active: true,
    created_at: "2025-11-06T10:30:00Z",
  },
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
