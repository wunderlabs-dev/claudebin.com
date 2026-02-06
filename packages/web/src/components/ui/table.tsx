"use client";

import { createContext, useContext, type ComponentProps } from "react";

import type { Role } from "@/supabase/types/message";

import { cn } from "@/utils/helpers";

const TableContext = createContext<Role>("assistant");

const useTableVariant = () => useContext(TableContext);

type TableProps = {
  variant?: Role;
} & ComponentProps<"table">;

const Table = ({ variant = "assistant", className, ...props }: TableProps) => {
  return (
    <TableContext.Provider value={variant}>
      <div
        data-slot="table-container"
        className={cn(
          "relative overflow-x-auto scrollbar-hidden",
          "w-full",
          "border border-gray-200 rounded-lg",
          variant === "user" ? "bg-gray-100" : undefined,
        )}
      >
        <table data-slot="table" className={cn("w-full caption-bottom", className)} {...props} />
      </div>
    </TableContext.Provider>
  );
};

type TableHeaderProps = ComponentProps<"thead">;

const TableHeader = ({ className, ...props }: TableHeaderProps) => {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b [&_tr]:border-gray-200", className)}
      {...props}
    />
  );
};

type TableBodyProps = ComponentProps<"tbody">;

const TableBody = ({ className, ...props }: TableBodyProps) => {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
};

type TableFooterProps = ComponentProps<"tfoot">;

const TableFooter = ({ className, ...props }: TableFooterProps) => {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-gray-100",
        "border-t border-gray-200",
        "font-medium",
        "[&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
};

type TableRowProps = ComponentProps<"tr">;

const TableRow = ({ className, ...props }: TableRowProps) => {
  const variant = useTableVariant();

  return (
    <tr
      data-slot="table-row"
      className={cn(
        "group",
        "border-b border-gray-200",
        "transition-colors",
        "data-[state=selected]:bg-gray-100",
        variant === "user" ? "hover:bg-gray-500/5" : "hover:bg-gray-500/10 hover:border-gray-100",
        className,
      )}
      {...props}
    />
  );
};

type TableHeadProps = ComponentProps<"th">;

const TableHead = ({ className, ...props }: TableHeadProps) => {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "align-middle",
        "px-4 py-3",
        "border-r border-gray-200",
        "font-medium text-left text-lg text-white whitespace-nowrap",
        "transition-colors",
        "last:border-r-0 group-hover:border-gray-100",
        className,
      )}
      {...props}
    />
  );
};

type TableCellProps = ComponentProps<"td">;

const TableCell = ({ className, ...props }: TableCellProps) => {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "align-middle",
        "px-4 py-3",
        "border-r border-gray-200",
        "text-base text-white whitespace-nowrap",
        "transition-colors",
        "last:border-r-0 group-hover:border-gray-100",
        className,
      )}
      {...props}
    />
  );
};

type TableCaptionProps = ComponentProps<"caption">;

const TableCaption = ({ className, ...props }: TableCaptionProps) => {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4", "text-sm text-gray-400", className)}
      {...props}
    />
  );
};

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
