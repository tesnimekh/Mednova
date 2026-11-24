import { useEffect, useState } from "react";
import { apiGet } from "../services/api.js";

export default function Home() {
  const [status, setStatus] = useState("loading...");

  useEffect(() => {
    apiGet("/health")
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("API unreachable"));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-bold">Mednova</h1>
      <p className="text-gray-600">
        API status: <span className="font-semibold">{status}</span>
      </p>
    </main>
  );
}
