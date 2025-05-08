'use client';
import {useState} from "react";
import Image from "next/image";
import logo from "@/../public/logo.png";
import {createClient} from "@/utils/supabase/client";
import {useRouter} from "next/navigation";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const router = useRouter();


    const poo = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const supabase = await createClient();
        const data = {email: email, password: password};
        const { error } = await supabase.auth.signInWithPassword(data)
        if (error) {
            alert('RUH ROH!')
            return error;
        }
        router.push("/explore");
    }


    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md text-center">
              <div className="flex justify-center mb-4">
                  <Image src={logo} alt="CampusClaims Logo" width={150} height={150} />
              </div>
              <h2 className="text-2xl font-bold text-[#2563eb] mb-6">{"Login To Your Account"}</h2>
              <form onSubmit={poo}>
                  <div className="mb-4 text-left">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                          type="email"
                          className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                          placeholder="you@example.com"
                          onChange={(e) => setEmail(e.target.value)}
                      />
                  </div>

                  <div className="mb-6 text-left">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <input
                          type="password"
                          className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                          placeholder="••••••••"
                          onChange={(e) => {setPassword(e.target.value)}}
                      />
                  </div>

                  <button
                      type="submit"
                      className="w-full bg-[#2563eb] text-white py-2 px-4 rounded hover:bg-blue-600 cursor-pointer"
                  >
                      Login
                  </button>
              </form>

              <p className="mt-4 text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
              </p>
          </div>
      </div>
  );
}
