import Image from "next/image";

export default function LoginPage() {
  return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Image
                src="/logo.png" // <- put your image in public/logo.png
                alt="CampusClaims logo"
                width={120}
                height={120}
            />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">
            Login to CampusClaims
          </h1>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                  type="email"
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                  type="password"
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  placeholder="••••••••"
              />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-600 underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
  );
}
