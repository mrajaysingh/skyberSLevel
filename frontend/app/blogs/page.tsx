"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Search, Calendar, User, ArrowRight, BookOpen, Shield, Code, Smartphone, Palette, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Blog categories
const categories = [
  { id: "all", name: "All Posts", icon: <BookOpen className="w-4 h-4" />, count: 12 },
  { id: "cybersecurity", name: "Cybersecurity", icon: <Shield className="w-4 h-4" />, count: 4 },
  { id: "web-development", name: "Web Development", icon: <Code className="w-4 h-4" />, count: 3 },
  { id: "mobile-apps", name: "Mobile Apps", icon: <Smartphone className="w-4 h-4" />, count: 2 },
  { id: "design", name: "UI/UX Design", icon: <Palette className="w-4 h-4" />, count: 2 },
  { id: "consulting", name: "Tech Consulting", icon: <Settings className="w-4 h-4" />, count: 1 },
];

// Sample blog posts
const blogPosts = [
  {
    id: 1,
    title: "The Future of Cybersecurity: AI-Powered Threat Detection",
    excerpt: "Discover how artificial intelligence is revolutionizing cybersecurity and helping organizations stay ahead of evolving threats.",
    category: "cybersecurity",
    author: "Sarah Chen",
    date: "2024-01-15",
    readTime: "8 min read",
    featured: true,
    image: "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 2,
    title: "Building Scalable Web Applications with Next.js 14",
    excerpt: "Learn the best practices for creating high-performance, scalable web applications using the latest features of Next.js 14.",
    category: "web-development",
    author: "Michael Rodriguez",
    date: "2024-01-12",
    readTime: "12 min read",
    featured: true,
    image: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 3,
    title: "Mobile App Development: Native vs Cross-Platform",
    excerpt: "A comprehensive comparison of native and cross-platform mobile development approaches for modern businesses.",
    category: "mobile-apps",
    author: "Emily Watson",
    date: "2024-01-10",
    readTime: "10 min read",
    featured: false,
    image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 4,
    title: "Designing for Accessibility: Creating Inclusive User Experiences",
    excerpt: "Explore the importance of accessibility in modern web design and how to implement inclusive design principles.",
    category: "design",
    author: "Alex Thompson",
    date: "2024-01-08",
    readTime: "6 min read",
    featured: false,
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 5,
    title: "Zero-Trust Security Architecture: A Modern Approach",
    excerpt: "Understanding the zero-trust security model and how it's reshaping enterprise cybersecurity strategies.",
    category: "cybersecurity",
    author: "David Kim",
    date: "2024-01-05",
    readTime: "9 min read",
    featured: false,
    image: "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 6,
    title: "Cloud-Native Development: Best Practices and Tools",
    excerpt: "Essential practices and tools for building cloud-native applications that scale efficiently.",
    category: "web-development",
    author: "Lisa Park",
    date: "2024-01-03",
    readTime: "11 min read",
    featured: false,
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 7,
    title: "The Rise of Progressive Web Apps (PWAs)",
    excerpt: "How Progressive Web Apps are changing the mobile landscape and providing native app-like experiences.",
    category: "mobile-apps",
    author: "James Wilson",
    date: "2024-01-01",
    readTime: "7 min read",
    featured: false,
    image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 8,
    title: "User Research Methods for Better Product Design",
    excerpt: "Effective user research methodologies that lead to better product design and user satisfaction.",
    category: "design",
    author: "Maria Garcia",
    date: "2023-12-28",
    readTime: "8 min read",
    featured: false,
    image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 9,
    title: "Digital Transformation: A Guide for Traditional Businesses",
    excerpt: "Strategic approaches for traditional businesses to successfully navigate digital transformation.",
    category: "consulting",
    author: "Robert Chen",
    date: "2023-12-25",
    readTime: "15 min read",
    featured: false,
    image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 10,
    title: "API Security: Protecting Your Digital Assets",
    excerpt: "Essential security measures for protecting APIs and ensuring secure data exchange between systems.",
    category: "cybersecurity",
    author: "Jennifer Lee",
    date: "2023-12-22",
    readTime: "10 min read",
    featured: false,
    image: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 11,
    title: "Performance Optimization Techniques for Modern Web Apps",
    excerpt: "Advanced techniques for optimizing web application performance and improving user experience.",
    category: "web-development",
    author: "Thomas Anderson",
    date: "2023-12-20",
    readTime: "13 min read",
    featured: false,
    image: "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 12,
    title: "Cybersecurity Compliance: Meeting Industry Standards",
    excerpt: "Understanding cybersecurity compliance requirements and how to implement effective security controls.",
    category: "cybersecurity",
    author: "Amanda Foster",
    date: "2023-12-18",
    readTime: "12 min read",
    featured: false,
    image: "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }
];

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [selectedCategory, searchQuery]);

  const featuredPosts = blogPosts.filter(post => post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Insights & <span className="text-[#17D492]">Knowledge</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Stay ahead of the curve with our expert insights on cybersecurity, 
              web development, and technology trends.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles, topics, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-border focus:border-[#17D492] focus:ring-[#17D492]/20"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                  selectedCategory === category.id 
                    ? "bg-[#17D492] hover:bg-[#14c082] text-white" 
                    : "hover:border-[#17D492] hover:text-[#17D492]"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon}
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {selectedCategory === "all" && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">Featured Articles</h2>
              <p className="text-muted-foreground">Handpicked insights from our experts</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                    <Link href={`/blogs/${generateSlug(post.title)}`}>
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={400}
                          height={192}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-[#17D492] text-white border-0">
                            {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.date)}
                          </span>
                          <span>{post.readTime}</span>
                        </div>
                        <CardTitle className="text-xl group-hover:text-[#17D492] transition-colors">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base mb-4">
                          {post.excerpt}
                        </CardDescription>
                        <Button 
                          variant="ghost" 
                          className="group-hover:text-[#17D492] p-0 h-auto font-medium"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {selectedCategory === "all" ? "All Articles" : `${categories.find(c => c.id === selectedCategory)?.name} Articles`}
            </h2>
            <p className="text-muted-foreground">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm h-full">
                  <Link href={`/blogs/${generateSlug(post.title)}`}>
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={400}
                        height={160}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-[#17D492] text-white border-0">
                          {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.date)}
                        </span>
                      </div>
                      <CardTitle className="text-lg group-hover:text-[#17D492] transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <CardDescription className="text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{post.readTime}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="group-hover:text-[#17D492] p-0 h-auto font-medium"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground text-lg">
                No articles found matching your criteria. Try adjusting your search or category selection.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

