"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function BlogPost() {
  const params = useParams();
  const { id } = params;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from your API
    // For now, we'll use mock data
    const fetchPost = () => {
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        const mockPost = {
          id: parseInt(id),
          title: "How to Choose the Perfect Land for Your Investment",
          content: `
            <p>Investing in land can be a lucrative opportunity, but it requires careful consideration of several factors to ensure you make a wise investment decision.</p>
            
            <h2>Location is Key</h2>
            <p>The old real estate adage "location, location, location" applies just as much to land as it does to residential properties. Consider the following:</p>
            <ul>
              <li>Proximity to urban centers or developing areas</li>
              <li>Access to transportation networks</li>
              <li>Surrounding amenities and infrastructure</li>
              <li>Future development plans for the area</li>
            </ul>
            
            <h2>Understand Zoning Regulations</h2>
            <p>Zoning laws dictate what you can and cannot do with a piece of land. Before purchasing, research:</p>
            <ul>
              <li>Current zoning classification</li>
              <li>Permitted uses under the zoning</li>
              <li>Potential for zoning changes in the future</li>
              <li>Any restrictions or easements on the property</li>
            </ul>
            
            <h2>Evaluate Physical Characteristics</h2>
            <p>The physical attributes of the land will impact its usability and value:</p>
            <ul>
              <li>Topography and elevation</li>
              <li>Soil quality and composition</li>
              <li>Natural features (trees, water bodies)</li>
              <li>Environmental concerns or hazards</li>
            </ul>
            
            <h2>Assess Utilities and Access</h2>
            <p>The availability of utilities and access can significantly affect development costs:</p>
            <ul>
              <li>Water and sewer connections</li>
              <li>Electricity and gas lines</li>
              <li>Internet and telecommunications</li>
              <li>Road access and condition</li>
            </ul>
            
            <h2>Consider Future Growth Potential</h2>
            <p>Land investment is often a long-term strategy, so consider:</p>
            <ul>
              <li>Population growth trends in the area</li>
              <li>Economic development plans</li>
              <li>Infrastructure projects in the pipeline</li>
              <li>Historical appreciation rates</li>
            </ul>
            
            <h2>Conclusion</h2>
            <p>By thoroughly researching these aspects, you can make an informed decision about your land investment. Remember that land is a finite resource, and with proper due diligence, it can be a valuable addition to your investment portfolio.</p>
          `,
          date: "May 15, 2023",
          author: "John Smith",
          category: "Investment",
          image: "/placeholder.jpg",
          authorImage: "/placeholder.jpg",
        };

        const mockRelatedPosts = [
          {
            id: 2,
            title: "Understanding Land Titles and Documentation",
            excerpt:
              "Before purchasing any land property, it's crucial to understand the various types of land titles and documentation...",
            date: "June 2, 2023",
            category: "Legal",
            image: "/placeholder.jpg",
          },
          {
            id: 3,
            title: "5 Factors That Affect Land Value",
            excerpt:
              "The value of land is influenced by numerous factors, from location to zoning regulations...",
            date: "June 20, 2023",
            category: "Market Trends",
            image: "/placeholder.jpg",
          },
          {
            id: 5,
            title: "How to Finance Your Land Purchase",
            excerpt:
              "Financing a land purchase differs from traditional home mortgages. Here's what you need to know...",
            date: "July 18, 2023",
            category: "Finance",
            image: "/placeholder.jpg",
          },
        ];

        setPost(mockPost);
        setRelatedPosts(mockRelatedPosts);
        setLoading(false);
      }, 500);
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-8"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/blog" className="text-primary hover:text-primary-text">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back to blog link */}
      <div className="max-w-3xl mx-auto mb-8">
        <Link
          href="/blog"
          className="text-primary hover:text-primary-text flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Blog
        </Link>
      </div>

      {/* Blog post header */}
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 mb-6">
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
          <div>
            <p className="font-medium">{post.author}</p>
            <p className="text-sm">
              {post.date} • {post.category}
            </p>
          </div>
        </div>
      </div>

      {/* Featured image */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="h-64 md:h-96 bg-gray-300 rounded-lg"></div>
      </div>

      {/* Blog content */}
      <div className="max-w-3xl mx-auto mb-12">
        <div
          className="prose lg:prose-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
      </div>

      {/* Share buttons */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="border-t border-b border-gray-200 py-6">
          <p className="font-medium mb-4">Share this article</p>
          <div className="flex space-x-4">
            <button className="p-2 bg-blue-600 text-white rounded-full">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button className="p-2 bg-blue-400 text-white rounded-full">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </button>
            <button className="p-2 bg-green-600 text-white rounded-full">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Related posts */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((relatedPost) => (
            <div
              key={relatedPost.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-40 bg-gray-300"></div>
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-2">
                  {relatedPost.date}
                </div>
                <h3 className="font-semibold mb-2">{relatedPost.title}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {relatedPost.excerpt}
                </p>
                <Link
                  href={`/blog/${relatedPost.id}`}
                  className="text-primary hover:text-primary-text text-sm"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
