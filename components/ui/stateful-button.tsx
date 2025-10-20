"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, onClick, disabled, type = "button", ...props }, ref) => {
    const [state, setState] = React.useState<"idle" | "loading" | "success">("idle");

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!onClick || state === "loading") return;

      setState("loading");
      try {
        await onClick(event);
        setState("success");
        setTimeout(() => setState("idle"), 2000);
      } catch (error) {
        setState("idle");
      }
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "relative inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-br from-black to-neutral-600 px-6 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition-all dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]",
          state === "loading" && "cursor-wait opacity-80",
          state === "success" && "bg-green-600 from-green-600 to-green-700",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        onClick={handleClick}
        disabled={disabled || state === "loading"}
        {...props}
      >
        <span className="relative flex items-center gap-2">
          {state === "loading" && (
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {state === "success" && (
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {state === "loading"
            ? "Processing..."
            : state === "success"
              ? "Success!"
              : children}
        </span>
      </button>
    );
  }
);

Button.displayName = "StatefulButton";

export { Button };
