import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Mail, Phone, MapPin, Calendar, Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  status: "uploading" | "completed" | "error";
  progress: number;
};

const EmployeeProfile = () => {
  const { toast } = useToast();
  const [resumeFiles, setResumeFiles] = useState<UploadedFile[]>([]);
  const [idFiles, setIdFiles] = useState<UploadedFile[]>([]);
  const [certificateFiles, setCertificateFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState<string | null>(null);

  const employee = {
    id: "E001",
    name: "Sarah Johnson",
    role: "Senior Developer",
    department: "Engineering",
    email: "sarah.j@company.com",
    phone: "+1 234-567-8901",
    status: "Active" as const,
    location: "New York, NY",
    joinDate: "Jan 15, 2022",
  };

  const handleDrag = (e: React.DragEvent, documentType: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(documentType);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  };

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only PDF, JPEG, and PNG files are allowed",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const simulateUpload = (file: File, setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>) => {
    const uploadedFile: UploadedFile = {
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
      status: "uploading",
      progress: 0,
    };

    setter((prev) => [...prev, uploadedFile]);

    const interval = setInterval(() => {
      setter((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id
            ? {
                ...f,
                progress: Math.min(f.progress + 10, 100),
                status: f.progress >= 90 ? "completed" : "uploading",
              }
            : f
        )
      );
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setter((prev) =>
        prev.map((f) => (f.id === uploadedFile.id ? { ...f, status: "completed", progress: 100 } : f))
      );
      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded`,
      });
    }, 2000);
  };

  const handleDrop = (
    e: React.DragEvent,
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (validateFile(file)) {
        simulateUpload(file, setter);
      }
    });
  };

  const handleFileInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>
  ) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (validateFile(file)) {
        simulateUpload(file, setter);
      }
    });
  };

  const removeFile = (
    id: string,
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>
  ) => {
    setter((prev) => prev.filter((f) => f.id !== id));
    toast({
      title: "File removed",
      description: "Document has been removed",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const UploadArea = ({
    documentType,
    files,
    setter,
  }: {
    documentType: string;
    files: UploadedFile[];
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  }) => (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
          dragActive === documentType
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50"
        }`}
        onDragEnter={(e) => handleDrag(e, documentType)}
        onDragLeave={(e) => handleDrag(e, documentType)}
        onDragOver={(e) => handleDrag(e, documentType)}
        onDrop={(e) => handleDrop(e, setter)}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium">Drop files here or click to browse</p>
            <p className="text-sm text-muted-foreground mt-1">
              PDF, JPEG, PNG up to 5MB
            </p>
          </div>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            id={`file-input-${documentType}`}
            onChange={(e) => handleFileInput(e, setter)}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById(`file-input-${documentType}`)?.click()}
          >
            Select Files
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Uploaded Files</h4>
          {files.map((file) => (
            <Card key={file.id} className="animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {file.status === "completed" && (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeFile(file.id, setter)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      {file.status === "uploading" && (
                        <>
                          <span>•</span>
                          <span>{file.progress}%</span>
                        </>
                      )}
                    </div>
                    {file.status === "uploading" && (
                      <Progress value={file.progress} className="mt-2 h-1" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Employee Profile</h1>
        <p className="text-muted-foreground mt-1">View and manage employee information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="gradient-accent text-accent-foreground font-semibold text-2xl">
                {getInitials(employee.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{employee.name}</CardTitle>
                  <p className="text-muted-foreground mt-1">{employee.id}</p>
                </div>
                <Badge variant="default" className="gradient-primary">
                  {employee.status}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm font-medium text-primary">{employee.role}</p>
                  <p className="text-sm text-muted-foreground">{employee.department}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Joined {employee.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{employee.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{employee.location}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="resume" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="resume">Resume</TabsTrigger>
              <TabsTrigger value="id">ID Documents</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
            </TabsList>
            <TabsContent value="resume" className="mt-6">
              <UploadArea documentType="resume" files={resumeFiles} setter={setResumeFiles} />
            </TabsContent>
            <TabsContent value="id" className="mt-6">
              <UploadArea documentType="id" files={idFiles} setter={setIdFiles} />
            </TabsContent>
            <TabsContent value="certificates" className="mt-6">
              <UploadArea
                documentType="certificates"
                files={certificateFiles}
                setter={setCertificateFiles}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeProfile;
