"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { like } from "@/actions/like";
import { cn } from "@/utils/helpers";
import { SvgIconHeart, SvgIconHeartSolid } from "@/components/icon";

type SessionLikeButtonProps = {
  sessionId: string;
  initialLiked: boolean;
  likeCount: number;
  isAuthenticated: boolean;
};

const SessionLikeButton = ({
  sessionId,
  initialLiked,
  likeCount,
  isAuthenticated,
}: SessionLikeButtonProps) => {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(likeCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isLoading) return;

    // Optimistic update
    const newLiked = !liked;
    setLiked(newLiked);
    setCount((prev) => (newLiked ? prev + 1 : prev - 1));
    setIsLoading(true);

    try {
      const result = await like(sessionId);

      if ("error" in result) {
        // Revert on error
        setLiked(!newLiked);
        setCount((prev) => (newLiked ? prev - 1 : prev + 1));
      }
    } catch {
      // Revert on error
      setLiked(!newLiked);
      setCount((prev) => (newLiked ? prev - 1 : prev + 1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-1 transition-colors",
        liked ? "text-red-500" : "text-gray-500 hover:text-red-400",
        isLoading && "opacity-50",
      )}
    >
      {liked ? <SvgIconHeartSolid size="sm" /> : <SvgIconHeart size="sm" />}
      <span className="text-sm">{count}</span>
    </button>
  );
};

export { SessionLikeButton };
