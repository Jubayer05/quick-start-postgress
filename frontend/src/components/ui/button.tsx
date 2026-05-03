import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "font-medium whitespace-nowrap select-none",
    "transition-opacity duration-100",
    "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring",
    "active:translate-y-px active:opacity-80",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        // Solid indigo — the main CTA
        primary: "bg-primary text-primary-foreground hover:opacity-88",

        // Tinted indigo surface — supporting action
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:bg-muted",

        // Transparent with indigo border — less visual weight
        outline:
          "bg-transparent text-primary border border-primary hover:bg-secondary",

        // Solid red — destructive actions
        danger: "bg-red-500 text-white hover:opacity-88",

        // Transparent neutral — tertiary / cancel
        ghost:
          "bg-transparent text-foreground border border-border hover:bg-muted",

        // Link-style button
        link: "bg-transparent text-primary underline-offset-4 hover:underline border-0",
      },

      size: {
        sm: "h-8  px-3.5 text-[13px] rounded-full",
        md: "h-10 px-5   text-sm     rounded-full",
        lg: "h-12 px-7   text-[15px] rounded-full",
        "icon-sm": "h-8 w-8 p-0 rounded-full",
        icon: "h-10 w-10 p-0 rounded-full",
      },

      shadow: {
        none: "shadow-none",
        sm: "shadow-sm shadow-foreground/10 dark:shadow-foreground/20",
        md: "shadow-md shadow-foreground/15 dark:shadow-foreground/25",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      shadow: "md",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant = "primary",
  size = "md",
  shadow = "md",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, shadow, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

/*
  USAGE
  ────────────────────────────────────────────
  import { Button } from "@/components/ui/button"

  <Button variant="primary">Save changes</Button>
  <Button variant="secondary">Cancel</Button>
  <Button variant="outline">View details</Button>
  <Button variant="danger">Delete account</Button>
  <Button variant="ghost">Dismiss</Button>

  Sizes:
  <Button size="sm">Small</Button>
  <Button size="md">Default</Button>  ← default
  <Button size="lg">Large</Button>

  With icon:
  <Button variant="primary">
    <PlusIcon />
    New project
  </Button>

  As link (asChild):
  <Button variant="outline" asChild>
    <a href="/docs">Read the docs</a>
  </Button>
  ────────────────────────────────────────────
*/
