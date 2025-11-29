import React, { useMemo, useState, type FormEvent } from 'react';
import '../styles/materials-page.css';
import type { LearningMaterial, LearningMaterialType } from '../materials/materialTypes';

type MaterialsPageProps = {
    teacherName: string | null;
    onBackToDashboard: () => void;
    onLogout: () => void;
};

const materialTypeLabels: Record<LearningMaterialType, string> = {
    lecture: 'Лекция',
    presentation: 'Презентация',
    video: 'Видео',
    scorm: 'SCORM-пакет',
};

const createEmptyMaterial = (): LearningMaterial => ({
    id: '',
    title: '',
    type: 'lecture',
    description: '',
    url: '',
    files: [],
});

const detectMaterialType = (file: File, fallback: LearningMaterialType): LearningMaterialType => {
    const name = file.name.toLowerCase();
    const mime = file.type.toLowerCase();

    if (name.endsWith('.zip')) {
        return 'scorm';
    }

    if (mime.startsWith('video/')) {
        return 'video';
    }

    if (name.endsWith('.ppt') || name.endsWith('.pptx') || name.endsWith('.key')) {
        return 'presentation';
    }

    return fallback;
};

export const MaterialsPage: React.FC<MaterialsPageProps> = ({
                                                                teacherName,
                                                                onBackToDashboard,
                                                                onLogout,
                                                            }) => {
    const [materials, setMaterials] = useState<LearningMaterial[]>([
        {
            id: '1',
            title: 'Введение в программирование',
            type: 'lecture',
            description: 'Основные понятия: алгоритмы, переменные, циклы.',
            url: 'https://example.com/lecture-1',
            files: [],
        },
        {
            id: '2',
            title: 'Презентация по HTML и CSS',
            type: 'presentation',
            description: 'Слайды к лекции по основам веб-разработки.',
            url: 'https://example.com/presentation-1',
            files: [],
        },
        {
            id: '3',
            title: 'Видео: Git и основы работы с репозиторием',
            type: 'video',
            description: 'Запись занятия по системам контроля версий.',
            url: 'https://example.com/video-1',
            files: [],
        },
    ]);

    const [editingMaterial, setEditingMaterial] = useState<LearningMaterial>(
        createEmptyMaterial(),
    );

    const [editingId, setEditingId] = useState<string | null>(null);
    const isEditMode = Boolean(editingId);

    const pageTitle = useMemo(
        () => (isEditMode ? 'Редактирование учебного материала' : 'Создание учебного материала'),
        [isEditMode],
    );

    const handleEditClick = (material: LearningMaterial) => {
        setEditingId(material.id);
        setEditingMaterial(material);
    };

    const handleCreateNewClick = () => {
        setEditingId(null);
        setEditingMaterial(createEmptyMaterial());
    };

    const handleDeleteClick = (id: string) => {
        if (!window.confirm('Удалить учебный материал?')) return;
        setMaterials((prev) => prev.filter((m) => m.id !== id));

        if (editingId === id) {
            handleCreateNewClick();
        }
    };

    const handleFormFieldChange = (
        field: keyof LearningMaterial,
        value: string,
    ) => {
        setEditingMaterial((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (!fileList || fileList.length === 0) {
            event.target.value = '';
            return;
        }

        const newFiles = Array.from(fileList).map((file) => ({
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            file,
            name: file.name,
            size: file.size,
        }));

        setEditingMaterial((prev) => {
            const nextFiles = [...prev.files, ...newFiles];
            let nextType = prev.type;
            if (prev.files.length === 0 && newFiles.length > 0) {
                nextType = detectMaterialType(newFiles[0].file, prev.type);
            }

            return {
                ...prev,
                files: nextFiles,
                type: nextType,
            };
        });

        event.target.value = '';
    };

    const handleRemovePendingFile = (fileId: string) => {
        setEditingMaterial((prev) => ({
            ...prev,
            files: prev.files.filter((f) => f.id !== fileId),
        }));
    };

    const handleMaterialFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!editingMaterial.title.trim()) {
            return;
        }

        const hasFiles = editingMaterial.files.length > 0;
        const hasUrl = Boolean(editingMaterial.url && editingMaterial.url.trim());

        if (!hasFiles && !hasUrl) {
            alert('Добавьте хотя бы один файл или укажите ссылку на материал.');
            return;
        }

        if (isEditMode && editingId) {
            setMaterials((prev) =>
                prev.map((material) =>
                    material.id === editingId ? { ...editingMaterial, id: editingId } : material,
                ),
            );
        } else {
            const newId = String(Date.now());
            const materialToAdd: LearningMaterial = {
                ...editingMaterial,
                id: newId,
            };

            setMaterials((prev) => [materialToAdd, ...prev]);
        }

        handleCreateNewClick();
    };

    const handleDownloadFile = (fileEntry: LearningMaterial['files'][number], title: string) => {
        const url = URL.createObjectURL(fileEntry.file);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileEntry.name || title || 'material';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <main
            className="materials"
            aria-labelledby="materials-title"
            role="main"
        >
            <header className="materials__header">
                <div className="materials__title-group">
                    <h1 id="materials-title" className="materials__title">
                        Учебные материалы
                    </h1>
                    <p className="materials__subtitle">
                        {pageTitle}. Преподаватель: {teacherName}
                    </p>
                </div>

                <div className="materials__header-actions">
                    <button
                        type="button"
                        className="materials__nav-button"
                        onClick={onBackToDashboard}
                    >
                        Вернуться в кабинет
                    </button>
                    <button
                        type="button"
                        className="materials__logout-button"
                        onClick={onLogout}
                    >
                        Выйти
                    </button>
                </div>
            </header>

            <div className="materials__layout">
                <section
                    className="materials-list"
                    aria-label="Список учебных материалов"
                >
                    <div className="materials-list__header">
                        <h2 className="materials-list__title">Ваши материалы</h2>
                    </div>

                    {materials.length === 0 ? (
                        <p className="materials-list__empty">
                            Пока нет учебных материалов. Создайте первый материал с помощью формы справа.
                        </p>
                    ) : (
                        <ul className="materials-list__items">
                            {materials.map((material) => (
                                <li
                                    key={material.id}
                                    className="materials-list__item"
                                >
                                    <article className="materials-card">
                                        <header className="materials-card__header">
                                            <h3 className="materials-card__title">
                                                {material.title}
                                            </h3>
                                            <span className="materials-card__type">
                        {materialTypeLabels[material.type]}
                      </span>
                                        </header>

                                        <p className="materials-card__description">
                                            {material.description || 'Без описания'}
                                        </p>

                                        {/* Внешняя ссылка (если есть) */}
                                        {material.url && (
                                            <a
                                                href={material.url}
                                                className="materials-card__link"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Открыть материал по ссылке
                                            </a>
                                        )}

                                        {material.files.length > 0 && (
                                            <ul className="materials-card__files">
                                                {material.files.map((fileEntry) => (
                                                    <li key={fileEntry.id} className="materials-card__file-item">
                            <span>
                              {fileEntry.name} ({Math.round(fileEntry.size / 1024)} КБ)
                            </span>
                                                        <button
                                                            type="button"
                                                            className="materials-card__button"
                                                            onClick={() => handleDownloadFile(fileEntry, material.title)}
                                                        >
                                                            Скачать
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        <footer className="materials-card__footer">
                                            <button
                                                type="button"
                                                className="materials-card__button"
                                                onClick={() => handleEditClick(material)}
                                            >
                                                Редактировать
                                            </button>
                                            <button
                                                type="button"
                                                className="materials-card__button materials-card__button--danger"
                                                onClick={() => handleDeleteClick(material.id)}
                                            >
                                                Удалить
                                            </button>
                                        </footer>
                                    </article>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section
                    className="materials-form"
                    aria-label="Форма создания и редактирования учебных материалов"
                >
                    <h2 className="materials-form__title">
                        {isEditMode ? 'Редактирование материала' : 'Новый материал'}
                    </h2>

                    <form
                        className="materials-form__body"
                        onSubmit={handleMaterialFormSubmit}
                    >
                        <div className="materials-form__field">
                            <label
                                className="materials-form__label"
                                htmlFor="material-title"
                            >
                                Название
                            </label>
                            <input
                                id="material-title"
                                className="materials-form__input"
                                type="text"
                                value={editingMaterial.title}
                                onChange={(event) =>
                                    handleFormFieldChange('title', event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="materials-form__field">
                            <label
                                className="materials-form__label"
                                htmlFor="material-type"
                            >
                                Тип материала
                            </label>
                            <select
                                id="material-type"
                                className="materials-form__select"
                                value={editingMaterial.type}
                                onChange={(event) =>
                                    handleFormFieldChange(
                                        'type',
                                        event.target.value as LearningMaterialType,
                                    )
                                }
                            >
                                <option value="lecture">Лекция</option>
                                <option value="presentation">Презентация</option>
                                <option value="video">Видео</option>
                                <option value="scorm">SCORM-пакет</option>
                            </select>
                        </div>

                        <div className="materials-form__field">
                            <label
                                className="materials-form__label"
                                htmlFor="material-description"
                            >
                                Краткое описание
                            </label>
                            <textarea
                                id="material-description"
                                className="materials-form__textarea"
                                value={editingMaterial.description}
                                onChange={(event) =>
                                    handleFormFieldChange('description', event.target.value)
                                }
                                rows={4}
                            />
                        </div>

                        <div className="materials-form__field">
                            <label
                                className="materials-form__label"
                                htmlFor="material-files"
                            >
                                Файлы материала
                            </label>
                            <input
                                id="material-files"
                                className="materials-form__input"
                                type="file"
                                multiple
                                onChange={handleFilesChange}
                            />
                            <p className="materials-form__hint">
                                Можно добавить несколько документов, презентаций, видео или SCORM-пакетов (zip).
                            </p>

                            {editingMaterial.files.length > 0 && (
                                <ul className="materials-form__files">
                                    {editingMaterial.files.map((fileEntry) => (
                                        <li key={fileEntry.id} className="materials-form__file-item">
                      <span>
                        {fileEntry.name} ({Math.round(fileEntry.size / 1024)} КБ)
                      </span>
                                            <button
                                                type="button"
                                                className="materials-form__file-remove"
                                                onClick={() => handleRemovePendingFile(fileEntry.id)}
                                            >
                                                Удалить
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="materials-form__field">
                            <label
                                className="materials-form__label"
                                htmlFor="material-url"
                            >
                                Ссылка на материал
                            </label>
                            <input
                                id="material-url"
                                className="materials-form__input"
                                type="url"
                                value={editingMaterial.url ?? ''}
                                onChange={(event) =>
                                    handleFormFieldChange('url', event.target.value)
                                }
                                placeholder="https://..."
                            />
                        </div>

                        <div className="materials-form__actions">
                            <button
                                type="submit"
                                className="materials-form__submit"
                            >
                                {isEditMode ? 'Сохранить изменения' : 'Создать материал'}
                            </button>

                            {isEditMode && (
                                <button
                                    type="button"
                                    className="materials-form__cancel"
                                    onClick={handleCreateNewClick}
                                >
                                    Отменить редактирование
                                </button>
                            )}
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
};
