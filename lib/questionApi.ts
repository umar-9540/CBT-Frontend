import axios from "axios";
import { Question } from "./Interface";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const QUESTIONS_ENDPOINT = `${API_BASE}/api/v1/questions`;

/**
 * Fetch all questions with optional filtering by testId and section
 */
export const getQuestions = async (
  testId?: string,
  section?: string
): Promise<Question[]> => {
  try {
    const params = new URLSearchParams();
    if (testId) params.append("testId", testId);
    if (section) params.append("section", section);
    
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await axios.get(`${QUESTIONS_ENDPOINT}${query}`);
    
    if (res.status === 200) {
      return res.data || [];
    }
    throw new Error(`Unexpected status: ${res.status}`);
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

/**
 * Fetch a single question by ID
 */
export const getQuestionById = async (questionId: string): Promise<Question> => {
  try {
    const res = await axios.get(`${QUESTIONS_ENDPOINT}/${questionId}`);
    if (res.status === 200) {
      return res.data;
    }
    throw new Error(`Unexpected status: ${res.status}`);
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
};

/**
 * Create a new question
 */
export const createQuestion = async (question: Omit<Question, "id" | "questionId">): Promise<Question> => {
  try {
    const res = await axios.post(QUESTIONS_ENDPOINT, question, {
      headers: { "Content-Type": "application/json" },
    });
    if (res.status === 201 || res.status === 200) {
      return res.data;
    }
    throw new Error(`Unexpected status: ${res.status}`);
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
};

/**
 * Update an existing question by ID
 */
export const updateQuestion = async (
  questionId: string,
  question: Partial<Question>
): Promise<Question> => {
  try {
    const res = await axios.put(`${QUESTIONS_ENDPOINT}/${questionId}`, question, {
      headers: { "Content-Type": "application/json" },
    });
    if (res.status === 200) {
      return res.data;
    }
    throw new Error(`Unexpected status: ${res.status}`);
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

/**
 * Delete a question by ID
 */
export const deleteQuestion = async (questionId: string): Promise<void> => {
  try {
    const res = await axios.delete(`${QUESTIONS_ENDPOINT}/${questionId}`);
    if (res.status === 200 || res.status === 204) {
      return;
    }
    throw new Error(`Unexpected status: ${res.status}`);
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
};
