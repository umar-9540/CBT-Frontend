import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const TESTS_ENDPOINT = `${API_BASE}/api/v1/tests`;

export const getTests = async () => {
  const res = await axios.get(TESTS_ENDPOINT);
  return res.data;
};

export const getTestById = async (testId: string) => {
  const res = await axios.get(`${TESTS_ENDPOINT}/test/${testId}`);
  return res.data;
};

export const createTest = async (test: any) => {
  const res = await axios.post(TESTS_ENDPOINT, test);
  return res.data;
};

export const deleteTest = async (testId: string) => {
  const res = await axios.delete(`${TESTS_ENDPOINT}/test/${testId}`);
  return res.data;
};
