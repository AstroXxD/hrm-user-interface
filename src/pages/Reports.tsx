import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Reports = () => {
  const employeeSummary = [
    {
      department: "Engineering",
      totalEmployees: 52,
      active: 50,
      onLeave: 2,
      avgTenure: "3.2 years",
    },
    {
      department: "Design",
      totalEmployees: 28,
      active: 27,
      onLeave: 1,
      avgTenure: "2.8 years",
    },
    {
      department: "Sales",
      totalEmployees: 35,
      active: 34,
      onLeave: 1,
      avgTenure: "2.5 years",
    },
    {
      department: "Marketing",
      totalEmployees: 22,
      active: 22,
      onLeave: 0,
      avgTenure: "2.1 years",
    },
    {
      department: "HR",
      totalEmployees: 15,
      active: 15,
      onLeave: 0,
      avgTenure: "4.5 years",
    },
  ];

  const leaveBalance = [
    {
      employeeId: "E001",
      name: "Sarah Johnson",
      department: "Engineering",
      totalLeave: 20,
      used: 8,
      remaining: 12,
    },
    {
      employeeId: "E002",
      name: "Michael Chen",
      department: "Design",
      totalLeave: 20,
      used: 5,
      remaining: 15,
    },
    {
      employeeId: "E003",
      name: "Emily Rodriguez",
      department: "Engineering",
      totalLeave: 22,
      used: 10,
      remaining: 12,
    },
    {
      employeeId: "E004",
      name: "David Kim",
      department: "Marketing",
      totalLeave: 20,
      used: 12,
      remaining: 8,
    },
    {
      employeeId: "E005",
      name: "Lisa Anderson",
      department: "HR",
      totalLeave: 22,
      used: 6,
      remaining: 16,
    },
  ];

  const handleExport = (reportType: string) => {
    console.log(`Exporting ${reportType} report...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">
            View and export employee analytics
          </p>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="animate-slide-up">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExport("employee-summary")}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <h3 className="font-semibold text-lg">Employee Summary</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Departmental breakdown
            </p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent-foreground" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExport("leave-balance")}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <h3 className="font-semibold text-lg">Leave Balance</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Employee leave status
            </p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-success flex items-center justify-center">
                <FileText className="w-6 h-6 text-success-foreground" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExport("attendance")}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <h3 className="font-semibold text-lg">Attendance Report</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Monthly attendance data
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Summary Report */}
      <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Employee Summary Report</CardTitle>
          <Button
            variant="outline"
            onClick={() => handleExport("employee-summary")}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Total Employees</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>On Leave</TableHead>
                <TableHead>Avg Tenure</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeSummary.map((row) => (
                <TableRow key={row.department}>
                  <TableCell className="font-medium">{row.department}</TableCell>
                  <TableCell>{row.totalEmployees}</TableCell>
                  <TableCell>
                    <Badge variant="default">{row.active}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.onLeave}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.avgTenure}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Leave Balance Report */}
      <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Leave Balance Report</CardTitle>
          <Button
            variant="outline"
            onClick={() => handleExport("leave-balance")}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Total Leave</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Remaining</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveBalance.map((row) => (
                <TableRow key={row.employeeId}>
                  <TableCell className="font-medium">{row.employeeId}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.department}
                  </TableCell>
                  <TableCell>{row.totalLeave}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.used}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{row.remaining}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
