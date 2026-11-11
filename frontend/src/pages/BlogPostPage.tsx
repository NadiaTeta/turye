import { Link, useParams } from "react-router-dom";
import { posts } from "../data/posts";
import { dishes } from "../data/dishes";
import { formatPrice } from "../lib/cart";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FoodImage from "../components/FoodImage";
import PlateVisual from "../components/PlateVisual";
import { PostMeta } from "./BlogPage";
import { usePageTitle } from "../lib/usePageTitle";

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  usePageTitle(post?.title ?? "Post not found");

  if (!post) {
    return (
      <div className="bg-cream min-h-screen flex flex-col">
        <div className="max-w-[1180px] mx-auto px-6 md:px-11 w-full">
          <Header />
        </div>
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
          <h1 className="font-display font-bold text-2xl text-green-deep mb-3">Post not found</h1>
          <p className="text-sm text-ink/70 mb-6">That post may have been moved or removed.</p>
          <Link
            to="/blog"
            className="bg-green-deep text-white rounded-full px-6 py-3 text-sm font-semibold"
          >
            Back to the blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const postDishes = post.dishIds.flatMap((id) => {
    const dish = dishes.find((d) => d.id === id);
    return dish ? [dish] : [];
  });
  const more = posts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 2);

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="max-w-[1180px] mx-auto px-6 md:px-11 w-full">
        <Header />
      </div>

      <main className="flex-1 max-w-[720px] mx-auto px-6 w-full pt-6 pb-20">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-deep mb-8"
        >
          ← Back to the blog
        </Link>

        <article>
          <PostMeta post={post} />
          <h1 className="font-display font-extrabold text-[2.2rem] md:text-[2.6rem] leading-[1.1] tracking-tight text-green-deep mt-3 mb-8">
            {post.title}
          </h1>
          {post.image ? (
            <img
              src={post.image}
              alt={post.imageAlt ?? ""}
              className="w-full aspect-[3/2] object-cover rounded-[28px] mb-10"
            />
          ) : (
            <PlateVisual blobs={post.blobs} size={200} className="mb-10 shadow-[0_16px_36px_rgba(27,42,32,0.14)]" />
          )}

          <div className="flex flex-col gap-5 text-[1.05rem] leading-[1.75] text-ink/85">
            {post.body.map((block, i) =>
              block.type === "h2" ? (
                <h2 key={i} className="font-display font-bold text-xl text-green-deep mt-4 -mb-1">
                  {block.text}
                </h2>
              ) : (
                <p key={i}>{block.text}</p>
              )
            )}
          </div>
        </article>

        {postDishes.length > 0 && (
          <section className="mt-14" aria-labelledby="post-dishes">
            <h2 id="post-dishes" className="font-display font-bold text-xl text-green-deep mb-5">
              Order {postDishes.length === 1 ? "this dish" : "the dishes in this post"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {postDishes.map((dish) => (
                <Link
                  key={dish.id}
                  to={`/menu?dish=${dish.id}`}
                  className="bg-card rounded-[24px] p-4 flex flex-col items-center text-center hover:-translate-y-1 transition-transform"
                >
                  <FoodImage src={dish.image} alt={dish.imageAlt ?? dish.name} blobs={dish.blobs} shape="tile" size={90} className="mb-3" />
                  <span className="font-display font-bold text-sm">{dish.name}</span>
                  <span className="text-green-deep font-bold text-sm mt-1">{formatPrice(dish.price)}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {more.length > 0 && (
          <section className="mt-14 border-t border-card-line pt-10" aria-labelledby="more-posts">
            <h2 id="more-posts" className="font-display font-bold text-xl text-green-deep mb-5">
              More from the kitchen
            </h2>
            <ul className="flex flex-col gap-4">
              {more.map((p) => (
                <li key={p.slug}>
                  <Link to={`/blog/${p.slug}`} className="group flex items-center gap-5">
                    <FoodImage src={p.image} alt="" blobs={p.blobs} shape="circle" size={64} />
                    <span>
                      <span className="block font-display font-bold text-base text-green-deep group-hover:underline decoration-gold decoration-2 underline-offset-4">
                        {p.title}
                      </span>
                      <span className="block text-sm text-ink/70 mt-0.5">{p.excerpt}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}