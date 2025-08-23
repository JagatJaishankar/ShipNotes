// Table components with perfected styling from design system
import React from 'react';

export const Table = ({ children, className = "" }) => (
  <div className="overflow-x-auto">
    <table className={`table table-zebra w-full bg-base-100 ${className}`}>
      {children}
    </table>
  </div>
);

export const TableHead = ({
  children,
  className = "lowercase font-extrabold text-base tracking-tight",
}) => <thead className={className}>{children}</thead>;

export const TableBody = ({ children, className = "" }) => (
  <tbody className={className}>{children}</tbody>
);

export const TableRow = ({
  children,
  clickable = false,
  className = "",
  ...props
}) => (
  <tr
    className={`border-base-300 ${clickable ? "cursor-pointer hover:bg-base-200" : ""} ${className}`}
    {...props}
  >
    {children}
  </tr>
);

export const TableCell = ({ children, className = "" }) => (
  <td className={`py-4 px-6 ${className}`}>{children}</td>
);

export const TableHeader = ({ children, className = "" }) => (
  <th
    className={`py-4 px-6 font-raleway font-bold tracking-tighter text-left text-neutral lowercase ${className}`}
  >
    {children}
  </th>
);