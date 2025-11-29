import { api } from './client';
import type { LearningMaterialType } from '../materials/materialTypes';

export type LearningMaterialFromApi = {
    id: number;
    title: string;
    description?: string | null;
    type: LearningMaterialType;
    url?: string | null;
    courseId: number;
};

export const materialsApi = {
    async getByCourse(courseId: number) {
        const response = await api.get<LearningMaterialFromApi[]>(
            `/materials/course/${courseId}`,
        );
        return response.data;
    },

    async create(params: {
        courseId: number;
        title: string;
        type: LearningMaterialType;
        file: File;
    }) {
        const formData = new FormData();
        formData.append('courseId', String(params.courseId));
        formData.append('title', params.title);
        formData.append('type', params.type);
        formData.append('file', params.file);

        const response = await api.post<LearningMaterialFromApi>(
            '/materials',
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            },
        );
        return response.data;
    },

    async delete(id: string | number) {
        await api.delete(`/materials/${id}`);
    },
};
