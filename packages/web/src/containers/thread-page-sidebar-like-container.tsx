"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { not, inc, dec } from "ramda";

import { like } from "@/actions/like";
import { useAuth } from "@/context/auth";

import { cn } from "@/utils/helpers";

import { SvgIconHeart, SvgIconHeartSolid } from "@/components/icon";
import { Typography } from "@/components/ui/typography";

type ThreadPageSidebarLikeContainerProps = {
  id: string;
  initialLiked?: boolean;
  likeCount: number;
};

const ThreadPageSidebarLikeContainer = ({
  id,
  initialLiked,
  likeCount,
}: ThreadPageSidebarLikeContainerProps) => {
  const t = useTranslations();
  const router = useRouter();

  const { user } = useAuth();

  const [count, setCount] = useState(likeCount);
  const [liked, setLiked] = useState(initialLiked);

  const { mutate, isPending } = useMutation({
    mutationFn: () => like(id),
    onMutate: () => {
      // Optimistic update — flip liked and adjust count
      // before server responds
      setLiked(not);
      setCount(liked ? dec : inc);
    },
    onError: () => {
      // Revert optimistic update on failure,
      // onSuccess reconciles with server state
      setLiked(not);
      setCount(liked ? inc : dec);
    },
    onSuccess: (result) => {
      setLiked(result.liked);
      setCount(result.likeCount);
    },
  });

  const handleClick = () => {
    if (user) {
      mutate();
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "flex cursor-pointer items-center gap-1 transition-colors duration-150 ease-in-out active:scale-95",
        liked ? "text-red-500" : "text-gray-500 hover:text-red-400",
        isPending ? "opacity-50" : "opacity-100",
      )}
    >
      <span className="shrink-0 transition-transform duration-150 ease-out active:scale-90">
        {liked ? <SvgIconHeartSolid size="sm" /> : <SvgIconHeart size="sm" />}
      </span>
      <Typography as="span" variant="caption" color="neutral" leading="normal">
        {t("common.likes", { count })}
      </Typography>
    </button>
  );
};

export { ThreadPageSidebarLikeContainer };
