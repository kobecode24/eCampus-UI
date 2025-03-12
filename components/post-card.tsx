import { ArrowUp, ArrowDown, MessageSquare, Code, Heart, HeartOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from 'react'
import { blogService } from '../services/api'
import { BlogDTO } from '@/app/types/blog'
import { CommentModal } from './comment-modal'
import { toast } from "@/components/ui/use-toast"

interface PostCardProps {
  title: string;
  author: string;
  content: string;
  category: string;
  votes: number;
  comments: number;
  codeSnippet: string;
  onComment?: () => void;
  post: BlogDTO;
  onLikeUpdate?: (postId: string, newLikeCount: number, hasLiked: boolean) => void;
}

const staticPosts: BlogDTO[] = [
  {
    id: "1",
    title: "Getting Started with React",
    content: "Learn the basics of React development...",
    authorUsername: "ReactMaster",
    likes: 42,
    comments: 5,
    category: "React",
    codeSnippet: "console.log('Hello World');",
    createdAt: new Date().toISOString(),
    hasLiked: false
  },
  {
    id: "2",
    title: "TypeScript Fundamentals",
    content: "Master TypeScript in 30 days...",
    authorUsername: "TypeScriptPro",
    likes: 35,
    comments: 2,
    category: "TypeScript",
    codeSnippet: "const greet = (name: string) => `Hello ${name}`;",
    createdAt: new Date().toISOString(),
    hasLiked: true
  }
];

export function PostCard({ post, onLikeUpdate }: PostCardProps) {
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null)
  const [score, setScore] = useState(post?.likes || 0)
  const [isLiking, setIsLiking] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [hasLiked, setHasLiked] = useState(post?.hasLiked || false)
  const [likeCount, setLikeCount] = useState(post?.likes || 0)

  useEffect(() => {
    // Initialize vote status and score when post data changes
    if (post) {
      setVoteStatus(post.hasLiked ? 'up' : null)
      setScore(post.likes)
      setHasLiked(post.hasLiked)
      setLikeCount(post.likes)
    }
  }, [post])

  const handleLikeToggle = async () => {
    try {
      setIsLiking(true)
      const response = await blogService.toggleLike(post.id)
      
      if (response.success) {
        const updatedPost = response.data
        setHasLiked(updatedPost.hasLiked)
        setLikeCount(updatedPost.likes)
        onLikeUpdate?.(post.id, updatedPost.likes, updatedPost.hasLiked)
      }
      
    } catch (error) {
      console.error('Failed to toggle like:', error)
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      })
    } finally {
      setIsLiking(false)
    }
  }

  if (!post) return null;

  return (
    <Card className="overflow-hidden border rounded-lg shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{post.title}</CardTitle>
          <Badge variant="outline" className="ml-2">
            {post.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback>{post.authorUsername[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{post.authorUsername}</span>
        </div>
        <p className="text-sm mb-4 text-gray-800 line-clamp-3">{post.content}</p>
        {post.codeSnippet && (
          <div className="bg-gray-100 p-2 rounded-md mb-4">
            <pre className="text-xs">
              <code>{post.codeSnippet}</code>
            </pre>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLikeToggle}
            disabled={isLiking}
            className="group transition-colors"
          >
            <Heart 
              className={`w-5 h-5 ${
                hasLiked 
                  ? 'fill-red-500 stroke-red-500'
                  : 'stroke-gray-500 fill-transparent'
              }`}
            />
            <span className={`ml-2 ${
              hasLiked ? 'text-red-500' : 'text-gray-500'
            }`}>
              {likeCount}
            </span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsCommentModalOpen(true)}
        >
          <MessageSquare className="mr-1 h-4 w-4" />
          <span className="text-sm font-medium">{post.comments.length}</span>
        </Button>
      </CardFooter>

      {isCommentModalOpen && (
        <CommentModal
          blogId={post.id}
          onClose={() => setIsCommentModalOpen(false)}
          onCommentAdded={() => {
            // Optionally refresh comment count or post data
          }}
        />
      )}
    </Card>
  )
}

  