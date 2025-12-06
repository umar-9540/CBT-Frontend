export const TEST = {
  id: "test001",
  title: "Sample Science Test",
  duration: 60, // minutes
  totalMarks: 100,
};

export const SECTIONS = ["PHYSICS", "CHEMISTRY", "MATHEMATICS", "BIOLOGY"];
export const QUESTIONS_PER_SECTION = 25;

export const QUESTIONS = [
  {
    id: "q1",
    test_id: "test001",
    section: "Physics",
    question_number: 1,
    type: "MCQ",
    stem: "What is the speed of light in vacuum?",
    marks: 4,
    negative_marks: -1,
  },
  {
    id: "q2",
    test_id: "test001",
    section: "Physics",
    question_number: 2,
    type: "INTEGER",
    stem: "What is the value of gravitational acceleration on Earth (in m/s²)?",
    marks: 4,
    negative_marks: -1,
  },
];

export interface QuestionOption {
  optionId: string;
  text: string;
  image: string | null;
}

export const QUESTION_OPTIONS: { [key: string]: QuestionOption[] } = {
  q1: [
    { optionId: "opt1", text: "3 × 10^8 m/s", image: null },
    { optionId: "opt2", text: "3 × 10^6 m/s", image: null },
    { optionId: "opt3", text: "3 × 10^10 m/s", image: null },
    { optionId: "opt4", text: "None of these", image: null },
  ],
  q2: [],
};

export interface Attachment {
  url: string;
  type: string;
  description?: string;
}

export const ATTACHMENTS: { [key: string]: Attachment[] } = {
  q1: [],
  q2: [],
};
