import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column<T extends Record<string, React.ReactNode>> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface DataTableProps<T extends Record<string, React.ReactNode>> {
  columns: Column<T>[];
  data: T[];
  actions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends Record<string, React.ReactNode>>({
  columns,
  data,
  actions,
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={index}>{column.header}</TableHead>
          ))}
          {actions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((column, colIndex) => (
              <TableCell key={colIndex}>
                {typeof column.accessor === "function"
                  ? column.accessor(item)
                  : item[column.accessor]}
              </TableCell>
            ))}
            {actions && <TableCell>{actions(item)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
