import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, Plus, Mail, Phone, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive" | "On Leave";
  location: string;
};

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const employees: Employee[] = [
    {
      id: "E001",
      name: "Sarah Johnson",
      role: "Senior Developer",
      department: "Engineering",
      email: "sarah.j@company.com",
      phone: "+1 234-567-8901",
      status: "Active",
      location: "New York, NY",
    },
    {
      id: "E002",
      name: "Michael Chen",
      role: "Product Designer",
      department: "Design",
      email: "michael.c@company.com",
      phone: "+1 234-567-8902",
      status: "Active",
      location: "San Francisco, CA",
    },
    {
      id: "E003",
      name: "Emily Rodriguez",
      role: "Engineering Manager",
      department: "Engineering",
      email: "emily.r@company.com",
      phone: "+1 234-567-8903",
      status: "On Leave",
      location: "Austin, TX",
    },
    {
      id: "E004",
      name: "David Kim",
      role: "Marketing Specialist",
      department: "Marketing",
      email: "david.k@company.com",
      phone: "+1 234-567-8904",
      status: "Active",
      location: "Seattle, WA",
    },
    {
      id: "E005",
      name: "Lisa Anderson",
      role: "HR Manager",
      department: "Human Resources",
      email: "lisa.a@company.com",
      phone: "+1 234-567-8905",
      status: "Active",
      location: "Boston, MA",
    },
    {
      id: "E006",
      name: "James Wilson",
      role: "Sales Director",
      department: "Sales",
      email: "james.w@company.com",
      phone: "+1 234-567-8906",
      status: "Inactive",
      location: "Chicago, IL",
    },
  ];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || emp.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Employee["status"]) => {
    switch (status) {
      case "Active":
        return "default";
      case "Inactive":
        return "secondary";
      case "On Leave":
        return "outline";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Directory</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view employee information
          </p>
        </div>
        <Button className="gradient-primary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or department..."
                className="pl-10 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 h-11">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.map((employee, index) => (
          <Card
            key={employee.id}
            className="animate-slide-up hover:shadow-elegant transition-all duration-300 cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="gradient-accent text-accent-foreground font-semibold">
                      {getInitials(employee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {employee.id}
                    </p>
                  </div>
                </div>
                <Badge variant={getStatusColor(employee.status)}>
                  {employee.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-primary">
                  {employee.role}
                </p>
                <p className="text-sm text-muted-foreground">
                  {employee.department}
                </p>
              </div>
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">
                    {employee.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {employee.location}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No employees found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Employees;
