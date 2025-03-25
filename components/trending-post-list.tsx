// components/trending-post-list.tsx
"use client"

import { useState, useEffect, useCallback } from 'react'
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { blogService } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { CreateBlogModal } from "@/components/create-blog-modal"
import { CommentSection } from "@/components/comment-section"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, PlusIcon, X } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { BlogDTO } from "@/app/types/blog"
import { CommentModal } from "@/components/comment-modal"
import { TrendingFilter } from "@/components/trending-filter"

type SortOption = "trending" | "latest" | "most-commented";
// Add static posts here instead of in PostCard
new Date().toISOString();
new Date().toISOString();
export function TrendingPostList() {
  const [posts, setPosts] = useState<BlogDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>("trending")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const { toast } = useToast()

  // Add this state to store all fetched posts
  const [allPosts, setAllPosts] = useState<BlogDTO[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogDTO[]>([])

  const fetchPosts = async (resetPage = false) => {
    try {
      setLoading(true);
      const currentPage = resetPage ? 0 : page;
      
      console.log(`Fetching posts: sortBy=${sortBy}, page=${currentPage}`);
      
      let response;
      
      // Only fetch from backend if not searching or first load
      switch (sortBy) {
        case "trending":
          response = await blogService.getTrendingBlogs(currentPage);
          break;
        case "latest":
          response = await blogService.getLatestBlogs(currentPage);
          break;
        case "most-commented":
          response = await blogService.getAllBlogs(currentPage, 10, "comments.size,desc");
          break;
        default:
          response = await blogService.getTrendingBlogs(currentPage);
      }

      if (response?.data?.success) {
        const newPosts = response.data.data.content.map((post: BlogDTO) => ({
          ...post,
          showComments: post.id === selectedPost,
          commentCount: post.comments?.length || 0
        }));
        
        // Check if we have more pages
        const hasNextPage = !response.data.data.last;
        
        // Store all posts for client-side filtering
        setAllPosts(prev => resetPage ? newPosts : [...prev, ...newPosts]);
        setHasMore(hasNextPage);
        setPage(prev => resetPage ? 1 : prev + 1);
        
        // If there's a search query active, filter the posts
        if (searchQuery.trim()) {
          filterPosts();
        } else {
          // Otherwise display all fetched posts directly
          setFilteredPosts(prev => resetPage ? newPosts : [...prev, ...newPosts]);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error loading posts",
        description: "Failed to load posts. Please try again.",
        variant: "destructive"
      });
      // Even if there's an error, we should set these to avoid showing misleading messages
      setFilteredPosts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Create a separate filter function
  const filterPosts = useCallback(() => {
    if (!searchQuery.trim()) {
      // If no search query, use all posts
      setFilteredPosts([...allPosts]);
      return;
    }
    
    // Apply search filter
    const query = searchQuery.toLowerCase();
    const filtered = allPosts.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.content.toLowerCase().includes(query) ||
      (post.authorUsername && post.authorUsername.toLowerCase().includes(query)) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
    );
    
    // Apply sorting
    const sortedFiltered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "trending":
          return b.likes - a.likes;
        case "latest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "most-commented":
          return (b.comments?.length || 0) - (a.comments?.length || 0);
        default:
          return 0;
      }
    });
    
    setFilteredPosts(sortedFiltered);
  }, [allPosts, searchQuery, sortBy]);

  // Replace the existing filterAndSortPosts useEffect
  useEffect(() => {
    filterPosts();
  }, [filterPosts]);

  // Update handleSearch to maintain hasMore flag
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // When searching, we want to show filtered results from all fetched posts,
    // but we don't want to override the hasMore flag
    filterPosts();
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value)
    // If we need new data based on sort, fetch it
    if (allPosts.length === 0) {
      fetchPosts(true)
    }
    // Otherwise just rely on the effect to resort
  }

  const handleCreateSuccess = () => {
    setShowCreateModal(false)
    fetchPosts(true)
    toast({
      title: "Success",
      description: "Your post has been created successfully!",
    })
  }
  const handleCommentAdded = async (postId: string) => {
    try {
      const response = await blogService.getBlogById(postId)
      if (response.data.success) {
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                commentCount: ((post as any).commentCount || 0) + 1,
                comments: response.data.data.comments 
              }
            : post
        ))
      }
    } catch (error) {
      console.error("Error updating comment count:", error)
    }
  }

  // Add this useEffect to fetch posts on component mount
  useEffect(() => {
    // Reset static posts and load real data from API
    setAllPosts([]);
    setFilteredPosts([]);
    fetchPosts(true);
  }, []); // Empty dependency array means it runs once on mount

  // Keep your existing effect for sort changes
  useEffect(() => {
    if (sortBy) { // Only fetch if sortBy has a value (skip initial render)
      fetchPosts(true);
    }
  }, [sortBy]);

  // Handle filter change from the TrendingFilter component
  const handleFilterChange = (value: SortOption) => {
    setSortBy(value);
    fetchPosts(true);
  }

  return (
    <div className="space-y-8">
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 rounded-lg backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Community Discussions</h2>
          <p className="text-gray-300">Join the conversation on the hottest tech topics</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2 rounded-full shadow-lg transform transition-all hover:scale-105"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create New Post
        </Button>
      </motion.div>

      <TrendingFilter 
        activeSort={sortBy} 
        onFilterChange={handleFilterChange} 
      />

      <motion.div 
        className="flex flex-wrap gap-4 items-center bg-white/5 p-4 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex-1 flex gap-2 relative">
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => handleSearch("")}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {filteredPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col gap-4"
              >
                <PostCard 
                  post={post}
                  onLikeUpdate={(postId, newLikes, hasLiked) => {
                    // Update both allPosts and filteredPosts
                    const updatePosts = (postList: BlogDTO[]) => 
                      postList.map(p => 
                        p.id === postId 
                          ? {...p, likes: newLikes, hasLiked} 
                          : p
                      );
                    
                    setAllPosts(updatePosts(allPosts));
                    setFilteredPosts(updatePosts(filteredPosts));
                  }}
                />
                
                <AnimatePresence>
                  {(post as any).showComments && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white/5 p-4 rounded-lg"
                    >
                      <CommentSection 
                        blogId={post.id}
                        onCommentAdded={() => handleCommentAdded(post.id)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-400"
          >
            {loading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p>Loading discussions...</p>
              </div>
            ) : (
              <div>
                No posts found. {searchQuery ? "Try a different search term." : "Be the first to post!"}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {(hasMore && !searchQuery.trim()) && (
        <motion.div
          className="mt-8 flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-white hover:text-purple-900 transition-colors duration-300 min-w-[200px]"
            onClick={() => fetchPosts()}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : (
              "Load More Discussions"
            )}
          </Button>
          <p className="text-gray-400 text-sm">
            Showing {filteredPosts.length} discussions
          </p>
        </motion.div>
      )}

      <CreateBlogModal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        {...({} as any)}
      />

      {selectedPost && (
        <CommentModal 
          blogId={selectedPost}
          onClose={() => setSelectedPost(null)}
          onCommentAdded={() => handleCommentAdded(selectedPost)}
        />
      )}
    </div>
  )
}