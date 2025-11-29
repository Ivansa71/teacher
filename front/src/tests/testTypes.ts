export type TestOption = {
    id: string;
    text: string;
    isCorrect: boolean;
};

export type TestQuestion = {
    id: string;
    text: string;
    options: TestOption[];
};

export type MultipleChoiceTest = {
    id: string;
    title: string;
    description: string;
    questions: TestQuestion[];
};

export type StudentTestResult = {
    id: string;
    studentName: string;
    testId: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    passedAt: string; // ISO-строка даты
};

export type TestWithResults = {
    test: MultipleChoiceTest;
    results: StudentTestResult[];
};
