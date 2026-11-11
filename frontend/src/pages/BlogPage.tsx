import { useState } from "react";
import { Link } from "react-router-dom";
import type { Post, PostCategory } from "../types";
import { categoryLabel, formatPostDate, postCategories, posts } from "../data/posts";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PlateVisual from "../components/PlateVisual";
import { usePageTitle } from "../lib/usePageTitle";

type Filter = PostCategory | "all";

export default function BlogPage() {
  usePageTitle("Blog");
  const [filter, setFilter] = useState<Filter>("all");

  const sorted = [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const visible = filter === "all" ? sorted : sorted.filter((p) => p.category === filter);
  // The newest post gets the large spot when nothing is filtered.
  const [featured, ...rest] = filter === "all" ? visible : [undefined, ...visible];

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All posts" },
    ...postCategories,
  ];

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="max-w-[1180px] mx-auto px-6 md:px-11 w-full">
        <Header />
      </div>

      <main className="flex-1 max-w-[1180px] mx-auto px-6 md:px-11 w-full pt-6 pb-20">
        <h1 className="font-display font-extrabold text-[2.6rem] leading-none tracking-tight text-green-deep mb-3">
          From the kitchen
        </h1>
        <p className="text-base text-ink/75 mb-8 max-w-lg">
          New dishes, how we cook, eating well and news from Turye.
        </p>

        <div className="flex flex-wrap gap-2.5 mb-10" role="group" aria-label="Filter posts">
          {filters.map((f) => {
            const isActive = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(f.id)}
                className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-gold border-gold text-green-deep"
                    : "bg-white border-card-line text-ink hover:border-gold"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {featured && (
          <Link
            to={`/blog/${featured.slug}`}
            className="group bg-card rounded-[32px] p-6 md:p-10 flex items-center gap-8 md:gap-12 flex-wrap md:flex-nowrap mb-8"
          >
            {featured.image ? (
              <img
                src={featured.image}
                alt={featured.imageAlt ?? ""}
                className="w-full md:w-[46%] aspect-[3/2] object-cover rounded-[24px]"
              />
            ) : (
              <PlateVisual
                blobs={featured.blobs}
                size={220}
                className="mx-auto md:mx-0 shadow-[0_16px_36px_rgba(27,42,32,0.14)]"
              />
            )}
            <div className="flex-1 min-w-[240px]">
              <PostMeta post={featured} />
              <h2 className="font-display font-extrabold text-2xl md:text-3xl leading-tight text-green-deep mt-3 mb-3 group-hover:underline decoration-gold decoration-2 underline-offset-4">
                {featured.title}
              </h2>
              <p className="text-base leading-relaxed text-ink/80 max-w-lg">{featured.excerpt}</p>
            </div>
          </Link>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((post) => post && <PostCard key={post.slug} post={post} />)}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group bg-card rounded-[24px] p-4 pb-6 flex flex-col hover:-translate-y-1 transition-transform [&>*:not(img)]:px-2"
    >
      {post.image ? (
        <img
          src={post.image}
          alt={post.imageAlt ?? ""}
          loading="lazy"
          className="w-full aspect-[3/2] object-cover rounded-[18px] mb-5"
        />
      ) : (
        <PlateVisual blobs={post.blobs} size={96} className="mb-5" />
      )}
      <PostMeta post={post} />
      <h2 className="font-display font-bold text-lg leading-snug text-green-deep mt-2 mb-2 group-hover:underline decoration-gold decoration-2 underline-offset-4">
        {post.title}
      </h2>
      <p className="text-sm leading-relaxed text-ink/75">{post.excerpt}</p>
    </Link>
  );
}

export function PostMeta({ post }: { post: Post }) {
  return (
    <p className="text-xs text-muted flex flex-wrap gap-x-3 gap-y-1">
      <span className="font-semibold text-gold-deep">{categoryLabel(post.category)}</span>
      <span>{formatPostDate(post.publishedAt)}</span>
      <span>{post.readMinutes} min read</span>
    </p>
  );
}