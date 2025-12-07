export interface Student {
  id: string;
  roll_number: string;
  full_name: string;
  email: string | null;
  created_at: string;
}

export interface Test {
  // API-provided identifiers
  id: string;
  testId?: string; // e.g. "T-1002"

  // Human-readable fields
  testName?: string; // e.g. "Physics Mock Test"
  description?: string;

  // Questions / sections
  totalQuestions?: number;
  sections?: Section[];

  // Scoring
  negativeMarking?: NegativeMarking;
  maxMarks?: number;
  passingMarks?: number;

  // Timing / behavior
  durationInMins?: number;
  shuffleQuestions?: boolean;
  active?: boolean;

  // Timestamps (epoch ms)
  createdAt?: number;
  startAt?: number;
  expireAt?: number;
}

export interface NegativeMarking {
  enabled: boolean;
  perWrong: number;
}

export interface TestAttempt {
  id: string;
  student_id: string;
  test_id: string;
  score: number;
  attempted_date: string;
  completed: boolean;
  created_at: string;
}

export interface Question {
  id?: string;
  questionId?: string;
  testId: string;
  section: string; // enum
  type: Type; // enum
  stem: string;
  attachments?: string[];
  options?: Option[];
  correctAnswer: CorrectAnswer;
  tolerance?: number;
  marks: number;
  negativeMarks?: number;
  createdAt?: string;
  modifiedAt?: string;
}

export interface Section {
  count: number,
  integerType: number,
  name: string,
  mcqType: number
}

export enum Type {
  MCQ = "MCQ",
  INTEGER = "INTEGER",
}
export interface Option {
  optionId: string;
  text: string;
  image?: string;
}

export interface CorrectAnswer {
  answer: string;
  explanation?: string;
  attachments?: string[];
}

export interface QuestionAttachment {
  url: string;
}

export interface QuestionOption {
  optionId: string;
  text: string;
  image?: string | null;
}

export interface StudentAnswer {
  question_id: string;
  selected_option_id: string | null;
  integer_answer?: number;
  is_answered: boolean;
  answered_at: string;
}
