"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  User,
  Mail,
  Calendar,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      setUser(user);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle(); // 🔥 إصلاح crash

      if (data) setProfile(data);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  if (loading) return <Loader2 className="animate-spin text-white" />;

  return (
    <div className="min-h-screen p-10 text-white">

      <h1 className="text-3xl font-black mb-6">
        {profile.full_name || "مستخدم"}
      </h1>

      <p>{user?.email}</p>

      <p>
        {new Date(user?.created_at).toLocaleDateString()}
      </p>

    </div>
  );
}