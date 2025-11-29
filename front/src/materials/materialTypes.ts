export type LearningMaterialType = 'lecture' | 'presentation' | 'video' | 'scorm';

export type LearningMaterialFile = {
    id: string;
    file: File;
    name: string;
    size: number;
};

export type LearningMaterial = {
    id: string;
    title: string;
    type: LearningMaterialType;
    description: string;
    url?: string;
    files: LearningMaterialFile[];
};
