"use client"

import { useState, useEffect } from 'react'
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"

const sampleTrendingPosts = [
  {
    id: 1,
    title: "The Future of AI in Web Development",
    author: "AIEnthusiast",
    content: "As AI continues to evolve, its impact on web development is becoming increasingly significant. In this post, we'll explore how AI is shaping the future of web development, from intelligent code completion to automated testing and beyond.",
    category: "AI",
    votes: 156,
    comments: 42,
    codeSnippet: `import { useAI } from 'ai-web-assistant';

const CodeAssistant = () => {
  const { suggestion } = useAI(currentCode);
  return <div>{suggestion}</div>;
};`,
  },
  {
    id: 2,
    title: "Mastering TypeScript: Advanced Tips and Tricks",
    author: "TypeScriptNinja",
    content: "TypeScript has become an essential tool for many developers. This post dives into advanced TypeScript features and patterns that can help you write more robust and maintainable code.",
    category: "TypeScript",
    votes: 132,
    comments: 37,
    codeSnippet: `type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

const obj: DeepReadonly<SomeType> = deepFreeze(someObject);`,
  },
  {
    id: 3,
    title: "Optimizing React Performance: A Deep Dive",
    author: "ReactOptimizer",
    content: "Performance is crucial for a great user experience. In this comprehensive guide, we'll explore various techniques to optimize your React applications, from code splitting to memoization and efficient state management.",
    category: "React",
    votes: 118,
    comments: 29,
    codeSnippet: `import React, { useMemo, useCallback } from 'react';

const MemoizedComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => expensiveOperation(data), [data]);
  const handleClick = useCallback(() => {
    // Handle click event
  }, []);

  return <div onClick={handleClick}>{processedData}</div>;
});`,
  },
]

export function TrendingPostList() {
  const [posts, setPosts] = useState(sampleTrendingPosts)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
      {posts.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-purple-900 transition-colors duration-300">
            Load More Trending Discussions
          </Button>
        </div>
      )}
    </div>
  )
}

