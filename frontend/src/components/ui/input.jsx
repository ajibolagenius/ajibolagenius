import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-none border border-[var(--border-md)] bg-[var(--elevated)] px-3 py-2 text-[var(--white)] placeholder:text-[var(--subtle)] transition-colors focus-visible:outline-none focus-visible:border-[var(--sungold)] focus-visible:ring-2 focus-visible:ring-[rgba(232,160,32,0.1)] disabled:cursor-not-allowed disabled:opacity-50 text-sm font-body",
        className
      )}
      ref={ref}
      {...props} />
  );
})
Input.displayName = "Input"

export { Input }
