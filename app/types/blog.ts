import { BlogCommentDTO } from "./comment";

// types/blog.ts
export interface BlogDTO {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorUsername: string;
    authorAvatarUrl?: string;
    tags: string[];
    likes: number;
    hasLiked: boolean;
    comments: BlogCommentDTO[];
    createdAt: string;
    category?: string;
    codeSnippet?: string;
    published: boolean;
    publishedAt?: string;
    commentCount?: number;
    showComments?: boolean;
}