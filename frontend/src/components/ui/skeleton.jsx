import { cn } from "../../lib/utils"

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse bg-[var(--elevated)]", className)}
      {...props}
    />
  );
}

export { Skeleton }
