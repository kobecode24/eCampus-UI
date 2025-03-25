// types/comment.ts
export interface BlogCommentDTO {
    id: string;
    content: string;
    blogId: string;
    authorId: string;
    authorUsername: string;
    authorAvatarUrl?: string;
    createdAt: string;
    lastUpdatedAt?: string;
  }