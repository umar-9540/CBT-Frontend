export interface Student {
  id: string;
  roll_number: string;
  full_name: string;
  email: string | null;
  created_at: string;
}

export interface Test {
  id: string;
  name: string;
  description: string;
  posted_date: string;
  start_date: string;
  end_date: string;
  duration_minutes: number;
  total_marks: number;
  is_active: boolean;
  created_at: string;
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
