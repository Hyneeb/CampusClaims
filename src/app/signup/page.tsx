import Image from 'next/image';
import logo from '/public/logo.png';

export default function SignUpPage() {
  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex justify-center mb-4">
            <Image src={logo} alt="CampusClaims Logo" width={120} height={120} />
          </div>
          <h2 className="text-center text-2xl font-bold text-[#2563eb] mb-6">
            Sign Up for CampusClaims
          </h2>

          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                  type="email"
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  placeholder="you@example.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                  type="password"
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  placeholder="••••••••"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                  type="password"
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  placeholder="••••••••"
              />
            </div>

            <button
                type="submit"
                className="w-full bg-[#2563eb] text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
  );
}
