'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

type Post = { id: number; title: string; body: string; userId: number };
type Comment = { id: number; name: string; email: string; body: string };

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params?.id);

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userJson);

    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then(res => res.json())
      .then(data => {
        if (!user.isAdmin && data.userId !== user.id) {
          router.push('/posts');
        } else {
          setPost(data);
        }
      });

    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
      .then(res => res.json())
      .then(setComments)
      .finally(() => setLoading(false));
  }, [postId, router]);

  if (loading) return <p className="p-6">Loading post...</p>;
  if (!post) return <p className="p-6 text-red-500">Post not found or not accessible.</p>;

  return (
    <div className="w-full max-w-2xl mx-auto py-10 px-4">
      <Link href="/posts" className="text-blue-600 hover:text-blue-800 underline mb-4 inline-block">
        ← Back to Posts
      </Link>

      <div className="bg-white rounded-2xl shadow-md px-6 py-6 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {post.userId}
          </div>
          <div>
            <p className="font-medium text-gray-800">User {post.userId}</p>
            <p className="text-xs text-gray-400">Posted just now</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h1>
        <p className="text-gray-700 text-base">{post.body}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Comments</h2>
        <div className="space-y-5">
          {comments.map(comment => (
            <div
              key={comment.id}
              className="bg-white rounded-xl shadow-sm px-5 py-4 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-gray-800">{comment.name}</p>
                <p className="text-sm text-gray-500">{comment.email}</p>
              </div>
              <p className="text-gray-700">{comment.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
