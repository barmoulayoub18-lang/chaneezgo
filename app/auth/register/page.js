"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handle = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password, name);
      router.push("/dashboard");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <form onSubmit={handle}>
      <input onChange={(e) => setName(e.target.value)} placeholder="name" />
      <input onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      <input onChange={(e) => setPassword(e.target.value)} placeholder="password" />
      <button>Register</button>
    </form>
  );
}