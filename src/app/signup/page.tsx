import AuthWrapper from '@/components/AuthWrapper';

export default function SignUpPage() {
  return (
      <AuthWrapper title="Sign Up for CampusClaims">
        <form>
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
                type="email"
                className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                placeholder="you@example.com"
            />
          </div>

          <div className="mb-4 text-left">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
                type="password"
                className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                placeholder="••••••••"
            />
          </div>

          <div className="mb-6 text-left">
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

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </AuthWrapper>
  );
}
