import type { MultipleChoiceTest } from './testTypes';

const testsStorageKey = 'teacherTests';

export function loadTests(): MultipleChoiceTest[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(testsStorageKey);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as MultipleChoiceTest[];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Failed to load tests from storage', error);
        return [];
    }
}

export function saveTests(tests: MultipleChoiceTest[]): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(testsStorageKey, JSON.stringify(tests));
    } catch (error) {
        console.error('Failed to save tests to storage', error);
    }
}
