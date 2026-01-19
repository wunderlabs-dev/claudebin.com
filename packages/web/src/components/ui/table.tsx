import type * as React from "react";

import { cn } from "@/utils/helpers";

type TableProps = React.ComponentProps<"table">;

const Table = ({ className, ...props }: TableProps) => {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto rounded-lg border border-gray-175"
    >
      <table data-slot="table" className={cn("w-full caption-bottom", className)} {...props} />
    </div>
  );
};

type TableHeaderProps = React.ComponentProps<"thead">;

const TableHeader = ({ className, ...props }: TableHeaderProps) => {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b [&_tr]:border-gray-175", className)}
      {...props}
    />
  );
};

type TableBodyProps = React.ComponentProps<"tbody">;

const TableBody = ({ className, ...props }: TableBodyProps) => {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
};

type TableFooterProps = React.ComponentProps<"tfoot">;

const TableFooter = ({ className, ...props }: TableFooterProps) => {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-gray-175 bg-gray-100 font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
};

type TableRowProps = React.ComponentProps<"tr">;

const TableRow = ({ className, ...props }: TableRowProps) => {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "group border-b border-gray-175 transition-colors hover:border-gray-100 hover:bg-gray-500/10 data-[state=selected]:bg-gray-100",
        className,
      )}
      {...props}
    />
  );
};

type TableHeadProps = React.ComponentProps<"th">;

const TableHead = ({ className, ...props }: TableHeadProps) => {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "px-4 py-3 text-left align-middle text-xl font-medium text-white whitespace-nowrap",
        "border-r border-gray-175 last:border-r-0 transition-colors group-hover:border-gray-100",
        className,
      )}
      {...props}
    />
  );
};

type TableCellProps = React.ComponentProps<"td">;

const TableCell = ({ className, ...props }: TableCellProps) => {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-3 align-middle text-base text-white whitespace-nowrap",
        "border-r border-gray-175 last:border-r-0 transition-colors group-hover:border-gray-100",
        className,
      )}
      {...props}
    />
  );
};

type TableCaptionProps = React.ComponentProps<"caption">;

const TableCaption = ({ className, ...props }: TableCaptionProps) => {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-gray-400", className)}
      {...props}
    />
  );
};

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
