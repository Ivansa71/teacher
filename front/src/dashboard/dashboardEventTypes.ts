export type DashboardEventType = 'lesson' | 'meeting' | 'deadline';

export type DashboardEvent = {
    id: string;
    type: DashboardEventType;
    tag: string;
    title: string;
    course?: string;
    time?: string;
    participants?: string;
    worksCount?: string;
    deadline?: string;
};
