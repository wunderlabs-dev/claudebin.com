"use client";

import { createContext, use, type HTMLAttributes, type ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";
import { typographyVariants } from "@/components/ui/typography";

const FormControlVariants = ["default", "error"] as const;
type FormControlVariant = (typeof FormControlVariants)[number];

type FormControlContextValue = {
  variant: FormControlVariant;
};

const FormControlContext = createContext<FormControlContextValue>({
  variant: "default",
});

type FormControlProps = HTMLAttributes<HTMLDivElement> & {
  variant?: FormControlVariant;
};

const FormControl = ({ variant = "default", className, ...props }: FormControlProps) => {
  return (
    <FormControlContext.Provider value={{ variant }}>
      <div
        data-slot="form-control"
        data-variant={variant}
        className={cn("flex flex-col gap-3", className)}
        {...props}
      />
    </FormControlContext.Provider>
  );
};

const inputVariants = cva(
  [
    "flex",
    "h-12 w-full",
    "px-7 py-3",
    "bg-gray-200",
    "font-mono text-base text-white",
    "transition ease-in-out",
    "placeholder:text-gray-450",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "rounded-full border border-gray-50 focus:border-orange-50",
        error:
          "rounded-full border border-red-50 text-red-50 placeholder:text-red-50 focus:border-red-50",
        filled: "px-4 rounded-lg border-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type InputProps = ComponentProps<"input"> & VariantProps<typeof inputVariants>;

const Input = ({ className, variant, type = "text", ...props }: InputProps) => {
  const context = use(FormControlContext);
  const resolvedVariant = variant ?? context.variant;

  return (
    <input
      data-slot="input"
      data-variant={resolvedVariant}
      type={type}
      className={cn(inputVariants({ variant: resolvedVariant, className }))}
      {...props}
    />
  );
};

const inputLabelVariants = cva(typographyVariants({ variant: "small" }), {
  variants: {
    variant: {
      default: [],
      error: "text-red-50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type InputLabelProps = ComponentProps<"label">;

const InputLabel = ({ className, ...props }: InputLabelProps) => {
  const context = use(FormControlContext);

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: htmlFor is passed via props
    <label
      data-slot="input-label"
      className={cn("px-3", inputLabelVariants({ variant: context.variant }), className)}
      {...props}
    />
  );
};

export { FormControl, Input, InputLabel, inputVariants };
