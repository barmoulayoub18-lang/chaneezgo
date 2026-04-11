"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handle = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <form onSubmit={handle}>
      <input onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      <input onChange={(e) => setPassword(e.target.value)} placeholder="password" />
      <button>Login</button>
    </form>
  );
}