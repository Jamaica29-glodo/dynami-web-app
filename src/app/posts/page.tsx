'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    const isAdmin = user.isAdmin === true;
    const userId = user.id;

    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.json())
      .then(data => {
        if (isAdmin) {
          setPosts(data);
        } else {
          setPosts(data.filter((post: Post) => post.userId === userId));
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Loading posts...</p>;

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">News Feed</h1>
      <div className="space-y-6">
        {posts.map(post => (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-md px-6 py-4 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {post.userId}
              </div>
              <div>
                <p className="font-medium text-gray-800">User {post.userId}</p>
                <p className="text-xs text-gray-400">Just now</p>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
            <p className="text-gray-700 mb-4">{post.body}</p>
            <Link
              href={`/posts/${post.id}`}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              View Full Post
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
