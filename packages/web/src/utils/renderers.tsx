import type { ReactNode } from "react";

export const renderers = {
  gradient: (chunks: ReactNode) => (
    <span className="inline-block bg-linear-to-r from-orange-200 to-orange-50 bg-clip-text text-transparent">
      {chunks}
    </span>
  ),
};
