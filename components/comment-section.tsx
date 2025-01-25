"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Comment {
  id: number
  author: string
  content: string
  createdAt: string
}

export function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "ReduxFan",
      content: "I still prefer Redux for large-scale applications. The ecosystem and dev tools are unmatched.",
      createdAt: "2023-07-15T11:30:00Z",
    },
    {
      id: 2,
      author: "ZustandLover",
      content: "Zustand has been a game-changer for me. It's so simple and performant!",
      createdAt: "2023-07-15T12:15:00Z",
    },
  ])
  const [newComment, setNewComment] = useState("")

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        author: "CurrentUser", // In a real app, this would be the logged-in user
        content: newComment,
        createdAt: new Date().toISOString(),
      }
      setComments([...comments, comment])
      setNewComment("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitComment} className="mb-4">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-2"
          />
          <Button type="submit">Post Comment</Button>
        </form>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>{comment.author[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{comment.author}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

