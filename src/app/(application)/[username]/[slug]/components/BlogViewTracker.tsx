'use client';

import { recordBlogView } from '@/app/actions/blogActions';
import { useEffect } from 'react';

export function BlogViewTracker({ blogId }: { blogId: string }) {
  useEffect(() => {
    recordBlogView(blogId).catch((error) => {
      console.error('Failed to record blog view:', error);
    });
  }, [blogId]);

  return null;
}
