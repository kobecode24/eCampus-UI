export interface DocumentationDTO {
    id?: string;
    title: string;
    content: string;
    technology: string;
    status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
    tags?: string[];
    views?: number;
    authorId?: string;
    authorUsername?: string;
    sections?: DocumentationSectionDTO[];
    createdAt?: string;
    lastUpdatedAt?: string;
    version?: number;
}

export interface DocumentationSectionDTO {
    id?: string;
    documentationId?: string;
    title: string;
    content: string;
    orderIndex?: number;
    sectionId?: string;
}