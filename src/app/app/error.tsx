"use client";

import { useEffect } from "react";

export default function AppErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">🧧</div>
        <h1 className="text-2xl font-semibold text-[#171717] mb-2">
          红包应用出错了
        </h1>
        <p className="text-[#808080] mb-6 text-sm">
          请稍后重试，或检查钱包连接状态
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => unstable_retry()}
            className="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#171717] text-white border-none cursor-pointer transition-opacity hover:opacity-80"
          >
            重试
          </button>
        </div>
      </div>
    </div>
  );
}
