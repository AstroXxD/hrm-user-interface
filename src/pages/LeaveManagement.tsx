import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Check, X, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type LeaveRequest = {
  id: string;
  employeeName: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  duration: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
};

const LeaveManagement = () => {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const leaveRequests: LeaveRequest[] = [
    {
      id: "LR001",
      employeeName: "Sarah Johnson",
      employeeId: "E001",
      leaveType: "Vacation",
      startDate: "2025-11-01",
      endDate: "2025-11-05",
      duration: "5 days",
      reason: "Family vacation planned",
      status: "Pending",
    },
    {
      id: "LR002",
      employeeName: "Michael Chen",
      employeeId: "E002",
      leaveType: "Sick Leave",
      startDate: "2025-10-20",
      endDate: "2025-10-22",
      duration: "3 days",
      reason: "Medical appointment and recovery",
      status: "Approved",
    },
    {
      id: "LR003",
      employeeName: "Emily Rodriguez",
      employeeId: "E003",
      leaveType: "Personal",
      startDate: "2025-10-25",
      endDate: "2025-10-26",
      duration: "2 days",
      reason: "Personal matters",
      status: "Pending",
    },
    {
      id: "LR004",
      employeeName: "David Kim",
      employeeId: "E004",
      leaveType: "Vacation",
      startDate: "2025-10-15",
      endDate: "2025-10-18",
      duration: "4 days",
      reason: "Short trip",
      status: "Rejected",
    },
    {
      id: "LR005",
      employeeName: "Lisa Anderson",
      employeeId: "E005",
      leaveType: "Bereavement",
      startDate: "2025-10-28",
      endDate: "2025-10-30",
      duration: "3 days",
      reason: "Family emergency",
      status: "Pending",
    },
  ];

  const filteredRequests = leaveRequests.filter((request) => {
    if (statusFilter === "all") return true;
    return request.status === statusFilter;
  });

  const handleApprove = (request: LeaveRequest) => {
    toast({
      title: "Leave Approved",
      description: `Leave request for ${request.employeeName} has been approved.`,
    });
  };

  const handleReject = (request: LeaveRequest) => {
    toast({
      variant: "destructive",
      title: "Leave Rejected",
      description: `Leave request for ${request.employeeName} has been rejected.`,
    });
  };

  const getStatusColor = (status: LeaveRequest["status"]) => {
    switch (status) {
      case "Pending":
        return "outline";
      case "Approved":
        return "default";
      case "Rejected":
        return "secondary";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const pendingCount = leaveRequests.filter(
    (r) => r.status === "Pending"
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Leave Management</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage employee leave requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-gradient border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Approvals
                </p>
                <p className="text-3xl font-bold mt-2">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-gradient border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Approved This Month
                </p>
                <p className="text-3xl font-bold mt-2">12</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-gradient border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Rejected This Month
                </p>
                <p className="text-3xl font-bold mt-2">3</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <X className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="card-gradient border-2">
        <CardContent className="pt-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-64 h-11">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Leave Requests */}
      <div className="space-y-4">
        {filteredRequests.map((request, index) => (
          <Card
            key={request.id}
            className="animate-slide-up hover:shadow-elegant transition-all duration-300 card-gradient border-2"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="gradient-primary text-primary-foreground font-semibold">
                      {getInitials(request.employeeName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        {request.employeeName}
                      </h3>
                      <Badge variant={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {request.employeeId} • {request.leaveType}
                    </p>
                    <div className="flex items-center gap-4 text-sm mt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {request.startDate} to {request.endDate}
                        </span>
                      </div>
                      <Badge variant="outline">{request.duration}</Badge>
                    </div>
                    <p className="text-sm mt-3 text-muted-foreground">
                      <span className="font-medium">Reason:</span>{" "}
                      {request.reason}
                    </p>
                  </div>
                </div>

                {request.status === "Pending" && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleReject(request)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="gradient-success hover:opacity-90"
                      onClick={() => handleApprove(request)}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card className="card-gradient border-2">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No leave requests found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeaveManagement;
