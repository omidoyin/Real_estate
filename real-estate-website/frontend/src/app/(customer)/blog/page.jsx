"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "How to Choose the Perfect Land for Your Investment",
      excerpt:
        "Investing in land can be a lucrative opportunity, but it requires careful consideration of several factors...",
      date: "May 15, 2023",
      author: "John Smith",
      category: "Investment",
      image: "/placeholder.jpg",
    },
    {
      id: 2,
      title: "Understanding Land Titles and Documentation",
      excerpt:
        "Before purchasing any land property, it's crucial to understand the various types of land titles and documentation...",
      date: "June 2, 2023",
      author: "Sarah Johnson",
      category: "Legal",
      image: "/placeholder.jpg",
    },
    {
      id: 3,
      title: "5 Factors That Affect Land Value",
      excerpt:
        "The value of land is influenced by numerous factors, from location to zoning regulations...",
      date: "June 20, 2023",
      author: "Michael Brown",
      category: "Market Trends",
      image: "/placeholder.jpg",
    },
    {
      id: 4,
      title: "The Benefits of Investing in Rural Land",
      excerpt:
        "While urban properties often get the spotlight, rural land investments offer unique advantages...",
      date: "July 5, 2023",
      author: "Emily Davis",
      category: "Investment",
      image: "/placeholder.jpg",
    },
    {
      id: 5,
      title: "How to Finance Your Land Purchase",
      excerpt:
        "Financing a land purchase differs from traditional home mortgages. Here's what you need to know...",
      date: "July 18, 2023",
      author: "Robert Wilson",
      category: "Finance",
      image: "/placeholder.jpg",
    },
  ]);

  const [categories, setCategories] = useState([
    "All",
    "Investment",
    "Legal",
    "Market Trends",
    "Finance",
    "Development",
  ]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest insights, tips, and news about real
          estate investments and land properties.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blog Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="h-48 bg-gray-300 relative">
              {/* Placeholder for image */}
              <div className="h-48 bg-gray-300"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>{post.date}</span>
                <span className="mx-2">•</span>
                <span>{post.category}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">By {post.author}</span>
                <Link
                  href={`/blog/${post.id}`}
                  className="text-primary hover:text-primary-text"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Signup */}
      <div className="mt-16 bg-card-bg p-8 rounded-lg">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-600 mb-6">
            Get the latest blog posts and real estate insights delivered
            directly to your inbox.
          </p>
          <form className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
