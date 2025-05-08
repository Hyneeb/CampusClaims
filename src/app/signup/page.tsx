'use client';
import Image from "next/image";
import logo from "@/../public/logo.png";
import {useState} from "react";
import {createClient} from "@/utils/supabase/client";
import {useRouter} from "next/navigation";


export default function SignUpPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (password.length < 6){
        alert("Password must be at least 6 characters long!");
        return;
    }
    const supabase = await createClient()
    // // Handle form submission logic here
    // const formData = new FormData(event.currentTarget as HTMLFormElement);
    // const email = formData.get("email") as string;
    // const password = formData.get("password") as string;

    // Call Supabase sign-up function
    const {data, error} = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error signing up:", error.message);
      alert("Uh oh, seems like there was a problem signing you up. Please try again.");
      return;
    }

    if (data) {
      const new_data = await supabase.from("users")
          .update({username: username})
          .eq("id", data.user?.id)
          .select();
      if (new_data.error) {
        console.error("Error updating username:", new_data.error.message);
        alert("Uh oh, seems like there was a problem signing you up. Please try again.");
        return;
      }
      if (!new_data.data){
        alert("Uh oh, seems like there was a problem signing you up. Please try again.");
        return;
      }
      console.log("Sign-up successful:", data);
      alert("Sign-up successful! Please check your email for confirmation.");
      // Redirect to login page or dashboard
      router.push("/");
    }

  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  }


  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <Image src={logo} alt="CampusClaims Logo" width={150} height={150} />
          </div>
          <h2 className="text-2xl font-bold text-[#2563eb] mb-6">{"Signup For An Account Today!"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                  type="email"
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  placeholder="you@example.com"
                  name="email"
                  onChange={handleEmailChange}
              />
            </div>

            <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  placeholder="markiplier"
                  name="username"
                  onChange={handleUserNameChange}
              />
            </div>

            <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                  type="password"
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  placeholder="••••••••"
                  name="password"
                  onChange={handlePasswordChange}
              />
            </div>

            <div className="mb-6 text-left">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                  type="password"
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  placeholder="••••••••"
                  onChange={handleConfirmPasswordChange}
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
        </div>
      </div>
  );
}
