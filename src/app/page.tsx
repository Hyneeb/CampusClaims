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
            href="/posting/abc"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Go to Sample Post
        </Link>
      </div>
  );
}