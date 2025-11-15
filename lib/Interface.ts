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
  totalQuestions?: number | string;
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
  postedAt?: number;
  expireAt?: number;
}

export interface Section {
  name: string;
  count: number;
  mcqType?: number | null;
  integerType?: number | null;
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
  id: string;
  test_id: string;
  section: string;
  question_number: number;
  type: string;
  stem: string;
  marks: number;
  negative_marks: number;
}

export interface QuestionAttachment {
  url: string;
  type: string;
  description?: string;
}

export interface QuestionOption {
  optionId: string;
  text: string;
  image: string | null;
}

export interface StudentAnswer {
  question_id: string;
  selected_option_id: string | null;
  integer_answer?: number;
  is_answered: boolean;
  answered_at: string;
}
