import type * as React from "react";

import { cn } from "@/utils/helpers";

type TableProps = React.ComponentProps<"table">;

const Table = ({ className, ...props }: TableProps) => {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto rounded-lg border border-gray-200"
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
      className={cn("[&_tr]:border-gray-200 [&_tr]:border-b", className)}
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
        "border-gray-200 border-t bg-gray-100 font-medium [&>tr]:last:border-b-0",
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
        "group border-gray-200 border-b transition-colors hover:border-gray-100 hover:bg-gray-500/10 data-[state=selected]:bg-gray-100",
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
        "whitespace-nowrap px-4 py-3 text-left align-middle font-medium text-white text-xl",
        "border-gray-200 border-r transition-colors last:border-r-0 group-hover:border-gray-100",
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
        "whitespace-nowrap px-4 py-3 align-middle text-base text-white",
        "border-gray-200 border-r transition-colors last:border-r-0 group-hover:border-gray-100",
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
      className={cn("mt-4 text-gray-400 text-sm", className)}
      {...props}
    />
  );
};

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
