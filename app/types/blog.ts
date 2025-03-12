import { BlogCommentDTO } from "./comment";

// types/blog.ts
export interface BlogDTO {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorUsername: string;
    tags: string[];
    likes: number;
    hasLiked: boolean;
    comments: BlogCommentDTO[];
    createdAt: string;
    category?: string;
    codeSnippet?: string;
    published: boolean;
    publishedAt?: string;
}