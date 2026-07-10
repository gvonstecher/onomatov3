"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Native Payload login (email + password). Posts to Payload's REST login
// endpoint, which sets the httpOnly session cookie on success.
export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/payload-api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      // Full navigation so the AuthProvider remounts and re-reads the session.
      window.location.href = params.get("callbackUrl") || "/";
    } else {
      setError("Email o contraseña incorrectos");
    }
  };

  return (
    <main className="container mx-auto max-w-sm py-16">
      <h1 className="text-2xl font-bold mb-6">Acceder</h1>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-grisClaro rounded-md p-2"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-grisClaro rounded-md p-2"
          required
        />
        {error && <p className="text-rojo text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-rojo text-white rounded-md py-2 font-medium hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
