// types/blog.ts
export interface BlogDTO {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorUsername: string;
    tags: string[];
    likes: number;
    comments: any[];
    createdAt: string;
    category?: string;
    codeSnippet?: string;
    published: boolean;
    publishedAt?: string;
}