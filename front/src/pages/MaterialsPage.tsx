import React, {useMemo, useState, type FormEvent} from 'react';
import '../styles/materials-page.css';
import type {LearningMaterial, LearningMaterialType} from '../materials/materialTypes';

type MaterialsPageProps = {
    teacherName: string | null;
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

    if (name.endsWith('.zip')) return 'scorm';
    if (mime.startsWith('video/')) return 'video';
    if (name.endsWith('.ppt') || name.endsWith('.pptx') || name.endsWith('.key')) {
        return 'presentation';
    }

    return fallback;
};

export const MaterialsPage: React.FC<MaterialsPageProps> = ({
                                                                teacherName,
                                                            }) => {
    const [materials, setMaterials] = useState<LearningMaterial[]>([
        {
            id: '1',
            title: 'Методы управления проектами',
            type: 'lecture',
            description: 'Курс: Основы гибридного управления проектами.',
            url: '',
            files: [],
        },
        {
            id: '2',
            title: 'Типы задач в машинном обучении',
            type: 'presentation',
            description: 'Курс: Введение в машинное обучение.',
            url: '',
            files: [],
        },
        {
            id: '3',
            title: 'Внутреннее устройство хранилища данных',
            type: 'video',
            description: 'Курс: Основы хранения данных.',
            url: '',
            files: [],
        },
    ]);

    const [editingMaterial, setEditingMaterial] = useState<LearningMaterial>(createEmptyMaterial());
    const [editingId, setEditingId] = useState<string | null>(null);
    const isEditMode = Boolean(editingId);
    const [sortOption, setSortOption] = useState<'title' | 'type'>('title');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const pageTitle = useMemo(
        () => 'Учебные материалы к курсам',
        [],
    );

    const sortedMaterials = useMemo(() => {
        const copy = [...materials];
        if (sortOption === 'title') {
            return copy.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
        }
        if (sortOption === 'type') {
            return copy.sort((a, b) => a.type.localeCompare(b.type));
        }
        return copy;
    }, [materials, sortOption]);

    const openCreateModal = () => {
        setEditingId(null);
        setEditingMaterial(createEmptyMaterial());
        setIsModalOpen(true);
    };

    const openEditModal = (material: LearningMaterial) => {
        setEditingId(material.id);
        setEditingMaterial(material);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleDeleteClick = (id: string) => {
        if (!window.confirm('Удалить учебный материал?')) return;
        setMaterials(prev => prev.filter(m => m.id !== id));

        if (editingId === id) {
            setEditingId(null);
            setEditingMaterial(createEmptyMaterial());
            setIsModalOpen(false);
        }
    };

    const handleFormFieldChange = (field: keyof LearningMaterial, value: string) => {
        setEditingMaterial(prev => ({
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

        const newFiles = Array.from(fileList).map(file => ({
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            file,
            name: file.name,
            size: file.size,
        }));

        setEditingMaterial(prev => {
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
        setEditingMaterial(prev => ({
            ...prev,
            files: prev.files.filter(f => f.id !== fileId),
        }));
    };

    const handleMaterialFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!editingMaterial.title.trim()) return;

        const hasFiles = editingMaterial.files.length > 0;
        const hasUrl = Boolean(editingMaterial.url && editingMaterial.url.trim());

        if (!hasFiles && !hasUrl) {
            alert('Добавьте хотя бы один файл или укажите ссылку на материал.');
            return;
        }

        if (isEditMode && editingId) {
            setMaterials(prev =>
                prev.map(material =>
                    material.id === editingId
                        ? {...editingMaterial, id: editingId}
                        : material,
                ),
            );
        } else {
            const newId = String(Date.now());
            const materialToAdd: LearningMaterial = {
                ...editingMaterial,
                id: newId,
            };

            setMaterials(prev => [materialToAdd, ...prev]);
        }

        setIsModalOpen(false);
        setEditingId(null);
        setEditingMaterial(createEmptyMaterial());
    };

    const handleDownloadFile = (
        fileEntry: LearningMaterial['files'][number],
        title: string,
    ) => {
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
        <main className="materials" aria-labelledby="materials-title" role="main">
            <header className="materials__header">
                <div className="materials__title-group">
                    <p className="materials__breadcrumb">
                        Главная / Учебные материалы
                    </p>
                    <h1 id="materials-title" className="materials__title">
                        {pageTitle}
                    </h1>
                    {teacherName && (
                        <p className="materials__teacher">
                            Преподаватель: {teacherName}
                        </p>
                    )}
                </div>

                <div className="materials__header-actions">
                    <button
                        type="button"
                        className="materials__add-button"
                        onClick={openCreateModal}
                    >
                        Добавить материал
                    </button>

                    <select
                        className="materials__sort-select"
                        value={sortOption}
                        onChange={e => setSortOption(e.target.value as 'title' | 'type')}
                    >
                        <option value="type">по типу документа</option>
                        <option value="title">по названию</option>
                    </select>

                </div>
            </header>

            <section
                className="materials-list"
                aria-label="Список учебных материалов"
            >
                {sortedMaterials.length === 0 ? (
                    <p className="materials-list__empty">
                        Пока нет учебных материалов. Нажмите «Добавить материал», чтобы
                        создать первый.
                    </p>
                ) : (
                    <>
                        <ul className="materials-list__items">
                            {sortedMaterials.map(material => (
                                <li
                                    key={material.id}
                                    className="materials-list__item"
                                >
                                    <article className="materials-card">
                                        <header className="materials-card__header">
                                            <div className="materials-card__header-text">
                                                <h3 className="materials-card__title">
                                                    {material.title}
                                                </h3>

                                                <div className="materials-card__course-row">
                                                    <span className="materials-card__course-dot"/>
                                                    <span>
                                                     {material.description || 'Курс: будет указан позже.'}
                                                     </span>
                                                </div>
                                            </div>

                                            <span className="materials-card__type">
                                             {materialTypeLabels[material.type]}
                                                </span>
                                        </header>
                                        {(material.url || material.files.length > 0) && (
                                            <button
                                                type="button"
                                                className="materials-card__link-button"
                                                onClick={() => {
                                                    if (material.url) {
                                                        window.open(material.url, '_blank', 'noreferrer');
                                                    } else if (material.files[0]) {
                                                        handleDownloadFile(material.files[0], material.title);
                                                    }
                                                }}
                                            >
                                                Открыть файл
                                            </button>
                                        )}

                                        {material.files.length > 1 && (
                                            <ul className="materials-card__files">
                                                {material.files.slice(1).map(fileEntry => (
                                                    <li
                                                        key={fileEntry.id}
                                                        className="materials-card__file-item"
                                                    >
                                                         <span>
                                                             {fileEntry.name} (
                                                                {Math.round(fileEntry.size / 1024)} КБ)
                                                         </span>
                                                        <button
                                                            type="button"
                                                            className="materials-card__link-button"
                                                            onClick={() =>
                                                                handleDownloadFile(fileEntry, material.title)
                                                            }
                                                        >
                                                            Открыть файл
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        <footer className="materials-card__footer">
                                            <button
                                                type="button"
                                                className="materials-card__button materials-card__button--edit"
                                                onClick={() => openEditModal(material)}
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

                        <div className="materials-list__show-more">
                            <button
                                type="button"
                                className="materials-list__show-more-btn"
                            >
                                Показать ещё
                            </button>
                        </div>
                    </>
                )}
            </section>

            {isModalOpen && (
                <div
                    className="materials-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="materials-modal-title"
                    onClick={closeModal}
                >
                    <div
                        className="materials-modal__content"
                        onClick={e => e.stopPropagation()}
                    >
                        <header className="materials-modal__header">
                            <h2
                                id="materials-modal-title"
                                className="materials-modal__title"
                            >
                                {isEditMode ? 'Редактирование материала' : 'Новый материал'}
                            </h2>
                            <button
                                type="button"
                                className="materials-modal__close"
                                onClick={closeModal}
                                aria-label="Закрыть"
                            >
                                ×
                            </button>
                        </header>

                        <form
                            className="materials-form"
                            onSubmit={handleMaterialFormSubmit}
                        >
                            <div className="materials-form__body">
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
                                        onChange={event =>
                                            handleFormFieldChange(
                                                'title',
                                                event.target.value,
                                            )
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
                                        onChange={event =>
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
                                        onChange={event =>
                                            handleFormFieldChange(
                                                'description',
                                                event.target.value,
                                            )
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
                                        Можно добавить несколько документов, презентаций,
                                        видео или SCORM-пакетов (zip).
                                    </p>

                                    {editingMaterial.files.length > 0 && (
                                        <ul className="materials-form__files">
                                            {editingMaterial.files.map(fileEntry => (
                                                <li
                                                    key={fileEntry.id}
                                                    className="materials-form__file-item"
                                                >
                                                    <span>
                                                        {fileEntry.name} (
                                                        {Math.round(
                                                            fileEntry.size / 1024,
                                                        )}{' '}
                                                        КБ)
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="materials-form__file-remove"
                                                        onClick={() =>
                                                            handleRemovePendingFile(
                                                                fileEntry.id,
                                                            )
                                                        }
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
                                        onChange={event =>
                                            handleFormFieldChange(
                                                'url',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="materials-form__actions">
                                <button
                                    type="submit"
                                    className="materials-form__submit"
                                >
                                    {isEditMode
                                        ? 'Сохранить изменения'
                                        : 'Создать материал'}
                                </button>

                                <button
                                    type="button"
                                    className="materials-form__cancel"
                                    onClick={closeModal}
                                >
                                    Отменить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};
