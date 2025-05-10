import Link from "next/link";

export default function Home() {
  return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white p-8">
        <Link
            href="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Go to Signup
        </Link>

        <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>

        <Link
            href="/posting/c3898659-48d5-4fcb-bc63-783aff8b6e18"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Go to Sample Post
        </Link>

          <Link
              href="/explore"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
              Explore!
          </Link>

          <Link
              href="/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
              Make a Post
          </Link>

          <Link
              href="/profile"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
              Go to Profile
          </Link>

      </div>
  );
}