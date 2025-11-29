
export type AssignmentStatus = 'draft' | 'published';
export type SubmissionStatus = 'submitted' | 'checked';

export type AssignmentAttachment = {
    id: string;
    name: string;
    url: string;
};

export type Assignment = {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: AssignmentStatus;
    maxScore: number;
    attachments: AssignmentAttachment[];
};

export type AssignmentSubmission = {
    id: string;
    assignmentId: string;
    studentName: string;
    submittedAt: string;
    fileUrl: string;
    commentFromStudent?: string;
    teacherComment?: string;
    score?: number;
    status: SubmissionStatus;
};
