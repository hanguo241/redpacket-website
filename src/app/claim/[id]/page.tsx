"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ClaimRedirect() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const id = params?.id as string;
    if (id) {
      router.replace(`/app?claim=${encodeURIComponent(id)}`);
    } else {
      router.replace("/app");
    }
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#fff" }}>
      <p style={{ fontSize: "14px", color: "#808080" }}>跳转中...</p>
    </div>
  );
}
