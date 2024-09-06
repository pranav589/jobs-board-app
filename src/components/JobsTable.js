import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontalIcon } from "lucide-react";

export default function JobsTable({
  data,
  columns,
  renderRow,
  renderActions,
  children,
}) {
  return (
    <div className="container mx-auto p-4">
      {children}
      <main>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((itemName) => (
                <TableHead key={itemName}>{itemName}</TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((job) => (
              <TableRow key={job.id}>
                {renderRow(job)}
                {renderActions(job)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
