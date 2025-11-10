"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock,
  Share2,
  BookOpen,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogTemplateProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  children: React.ReactNode;
  relatedPosts?: Array<{
    id: number;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    slug: string;
  }>;
}

export function BlogTemplate({
  title,
  excerpt,
  author,
  date,
  readTime,
  category,
  image,
  children,
  relatedPosts = []
}: BlogTemplateProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCategory = (cat: string) => {
    return cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#17D492]/10 via-transparent to-[#17D492]/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Back Button */}
            <Button
              asChild
              variant="ghost"
              className="mb-6 hover:bg-[#17D492]/10 hover:text-[#17D492]"
            >
              <Link href="/blogs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blogs
              </Link>
            </Button>

            {/* Category Badge */}
            <div className="mb-6">
              <Badge className="bg-[#17D492] text-white border-0 px-4 py-2 text-sm">
                <Tag className="w-4 h-4 mr-2" />
                {formatCategory(category)}
              </Badge>
            </div>

            {/* Blog Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                {title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
                {excerpt}
              </p>
              
              {/* Blog Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{readTime}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="hover:text-[#17D492]"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Featured Image */}
            {image && (
              <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none"
            style={{
              '--tw-prose-body': 'rgb(var(--muted-foreground))',
              '--tw-prose-headings': 'rgb(var(--foreground))',
              '--tw-prose-links': 'rgb(var(--foreground))',
              '--tw-prose-bold': 'rgb(var(--foreground))',
              '--tw-prose-counters': 'rgb(var(--muted-foreground))',
              '--tw-prose-bullets': 'rgb(var(--muted-foreground))',
              '--tw-prose-hr': 'rgb(var(--border))',
              '--tw-prose-quotes': 'rgb(var(--foreground))',
              '--tw-prose-quote-borders': 'rgb(var(--border))',
              '--tw-prose-captions': 'rgb(var(--muted-foreground))',
              '--tw-prose-code': 'rgb(var(--foreground))',
              '--tw-prose-pre-code': 'rgb(var(--muted-foreground))',
              '--tw-prose-pre-bg': 'rgb(var(--muted))',
              '--tw-prose-th-borders': 'rgb(var(--border))',
              '--tw-prose-td-borders': 'rgb(var(--border))',
            } as React.CSSProperties}
          >
            <style jsx>{`
              :global(.prose h2) {
                font-size: 2rem;
                line-height: 2.5rem;
                font-weight: 700;
                color: rgb(var(--foreground));
                margin-top: 2rem;
                margin-bottom: 1rem;
              }
              :global(.prose h3) {
                font-size: 1.5rem;
                line-height: 2rem;
                font-weight: 600;
                color: rgb(var(--foreground));
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
              }
              :global(.prose p) {
                font-size: 1.125rem;
                line-height: 1.75rem;
                color: rgb(var(--muted-foreground));
                margin-bottom: 1.5rem;
              }
              :global(.prose ul, .prose ol) {
                font-size: 1.125rem;
                line-height: 1.75rem;
                color: rgb(var(--muted-foreground));
                margin-bottom: 1.5rem;
                padding-left: 1.5rem;
              }
              :global(.prose li) {
                margin-bottom: 0.75rem;
              }
              :global(.prose strong) {
                font-weight: 600;
                color: rgb(var(--foreground));
              }
              :global(.prose a) {
                color: rgb(var(--foreground));
                text-decoration: underline;
                text-decoration-color: rgb(var(--border));
              }
              :global(.prose a:hover) {
                color: #17D492;
                text-decoration-color: #17D492;
              }
              :global(.prose code) {
                background-color: rgb(var(--muted));
                padding: 0.125rem 0.375rem;
                border-radius: 0.25rem;
                font-size: 0.875rem;
              }
              :global(.prose pre) {
                background-color: rgb(var(--muted));
                padding: 1rem;
                border-radius: 0.5rem;
                overflow-x: auto;
              }
              :global(.prose blockquote) {
                border-left: 4px solid rgb(var(--border));
                padding-left: 1rem;
                font-style: italic;
                color: rgb(var(--muted-foreground));
              }
              :global(.prose img) {
                border-radius: 0.5rem;
                margin: 2rem 0;
              }
            `}</style>
            {children}
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 p-8 bg-muted/30 rounded-2xl border border-border/50"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Enjoyed this article?
              </h3>
              <p className="text-muted-foreground mb-6">
                Share it with others who might find it valuable.
              </p>
              <Button
                onClick={handleShare}
                className="bg-[#17D492] hover:bg-[#14c082] text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Article
              </Button>
            </div>
          </motion.div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16"
            >
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm"
                  >
                    <Link href={`/blogs/${post.slug}`}>
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={400}
                          height={200}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-[#17D492] text-white border-0">
                            {formatCategory(post.category)}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.date)}
                          </span>
                          <span>{post.readTime}</span>
                        </div>
                        <CardTitle className="text-lg group-hover:text-[#17D492] transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Back to Blogs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="hover:border-[#17D492] hover:text-[#17D492]"
            >
              <Link href="/blogs">
                <BookOpen className="w-4 h-4 mr-2" />
                View All Articles
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

