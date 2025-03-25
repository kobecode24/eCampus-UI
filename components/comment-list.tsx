// components/comments/comment-list.tsx
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Loader2, ThumbsUp, ThumbsDown, MoreVertical } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BlogCommentDTO } from "@/app/types/comment"
import { UserAvatar } from "@/components/user-avatar"

interface CommentListProps {
  comments: BlogCommentDTO[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onDelete?: (commentId: string) => void;
  onEdit?: (commentId: string) => void;
  currentUserId?: string;
  totalComments?: number;
}

export function CommentList({ 
  comments, 
  loading, 
  hasMore, 
  onLoadMore,
  onDelete,
  onEdit,
  currentUserId,
  totalComments
}: CommentListProps) {
  
  const shouldShowLoadMore = hasMore && 
                            (totalComments ? totalComments >= 10 : comments.length >= 10) && 
                            comments.length < (totalComments || Infinity);

  return (
    <div className="space-y-4">
      {comments.length === 0 && !loading ? (
        <div className="text-center py-8 text-gray-400">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="divide-y divide-white/10">
          {comments.map((comment) => (
            <div key={comment.id} className="py-4 first:pt-0">
              <div className="flex items-start gap-3">
                <UserAvatar 
                  username={comment.authorUsername} 
                  avatarUrl={comment.authorAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.authorUsername)}&background=random`}
                  size="md"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">{comment.authorUsername}</span>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="text-gray-200 mt-1">{comment.content}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {shouldShowLoadMore && (
        <div className="text-center pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLoadMore}
            disabled={loading}
            className="text-white border-white/30 hover:bg-white/10"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Comments"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}