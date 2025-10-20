import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Mail, Phone, MapPin, Calendar, Upload, FileText, X, CheckCircle2, Eye, Download, Trash2, AlertCircle, Clock, Award, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  status: "uploading" | "completed" | "error";
  progress: number;
};

interface DocumentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  acceptedTypes: string[];
  maxSize: number; // in MB
}

const EmployeeProfile = () => {
  const { toast } = useToast();
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: UploadedFile[] }>({
    resume: [],
    id: [],
    certificates: []
  });
  const [dragActive, setDragActive] = useState<{ [key: string]: boolean }>({
    resume: false,
    id: false,
    certificates: false
  });

  const documentCategories: DocumentCategory[] = [
    {
      id: 'resume',
      name: 'Resume/CV',
      icon: <FileText className="w-5 h-5" />,
      description: 'Upload your latest resume or CV',
      acceptedTypes: ['.pdf', '.doc', '.docx'],
      maxSize: 5
    },
    {
      id: 'id',
      name: 'ID Documents',
      icon: <Image className="w-5 h-5" />,
      description: 'Government issued ID, passport, or driver\'s license',
      acceptedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
      maxSize: 10
    },
    {
      id: 'certificates',
      name: 'Certificates',
      icon: <Award className="w-5 h-5" />,
      description: 'Professional certificates, degrees, and qualifications',
      acceptedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
      maxSize: 10
    }
  ];

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

  const handleDrag = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(prev => ({ ...prev, [categoryId]: true }));
    } else if (e.type === "dragleave") {
      setDragActive(prev => ({ ...prev, [categoryId]: false }));
    }
  };

  const validateFile = (file: File, category: DocumentCategory): string | null => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!category.acceptedTypes.includes(fileExtension)) {
      return `File type not supported. Accepted types: ${category.acceptedTypes.join(', ')}`;
    }
    
    if (file.size > category.maxSize * 1024 * 1024) {
      return `File size too large. Maximum size: ${category.maxSize}MB`;
    }
    
    return null;
  };

  const simulateUpload = async (file: File, categoryId: string): Promise<UploadedFile> => {
    return new Promise((resolve, reject) => {
      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
        status: 'uploading',
        progress: 0
      };

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          clearInterval(interval);
          uploadedFile.status = 'completed';
          uploadedFile.progress = 100;
          resolve(uploadedFile);
        }
      }, 200);
    });
  };

  const handleFiles = async (files: FileList, categoryId: string) => {
    const category = documentCategories.find(cat => cat.id === categoryId);
    if (!category) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      const error = validateFile(file, category);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: errors.join('\n'),
      });
    }

    if (validFiles.length === 0) return;

    // Add files to uploading state
    const newUploadingFiles = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      url: '',
      uploadedAt: new Date(),
      status: 'uploading' as const,
      progress: 0
    }));

    setUploadingFiles(prev => ({
      ...prev,
      [categoryId]: [...prev[categoryId], ...newUploadingFiles]
    }));

    // Simulate uploads
    for (const file of validFiles) {
      try {
        const uploadedFile = await simulateUpload(file, categoryId);
        setUploadingFiles(prev => ({
          ...prev,
          [categoryId]: prev[categoryId].map(f => 
            f.id === uploadedFile.id ? uploadedFile : f
          )
        }));
        
        toast({
          title: "Upload Successful",
          description: `${file.name} has been uploaded successfully.`,
        });
      } catch (error) {
        setUploadingFiles(prev => ({
          ...prev,
          [categoryId]: prev[categoryId].map(f => 
            f.id === newUploadingFiles.find(nf => nf.name === file.name)?.id 
              ? { ...f, status: 'error' as const }
              : f
          )
        }));
        
      toast({
          variant: "destructive",
          title: "Upload Failed",
          description: `Failed to upload ${file.name}. Please try again.`,
      });
      }
    }
  };

  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [categoryId]: false }));
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files, categoryId);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, categoryId: string) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files, categoryId);
    }
  };

  const removeFile = (categoryId: string, fileId: string) => {
    setUploadingFiles(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].filter(f => f.id !== fileId)
    }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'uploading':
        return <Upload className="w-4 h-4 text-blue-500 animate-pulse" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'uploading':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const UploadArea = ({ categoryId }: { categoryId: string }) => {
    const category = documentCategories.find(cat => cat.id === categoryId);
    if (!category) return null;

    const files = uploadingFiles[categoryId] || [];

    return (
    <div className="space-y-4">
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive[categoryId]
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragEnter={(e) => handleDrag(e, categoryId)}
          onDragLeave={(e) => handleDrag(e, categoryId)}
          onDragOver={(e) => handleDrag(e, categoryId)}
          onDrop={(e) => handleDrop(e, categoryId)}
        >
          <input
            type="file"
            multiple
            accept={category.acceptedTypes.join(',')}
            onChange={(e) => handleFileInput(e, categoryId)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            
            <div>
              <p className="text-lg font-medium">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Accepted formats: {category.acceptedTypes.join(', ')}
              </p>
              <p className="text-sm text-muted-foreground">
                Maximum file size: {category.maxSize}MB
              </p>
            </div>
        </div>
      </div>

        {/* File List */}
      {files.length > 0 && (
          <div className="space-y-2">
          <h4 className="font-medium">Uploaded Files</h4>
          {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(file.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{file.name}</h4>
                      <Badge className={getStatusColor(file.status)}>
                        {file.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {file.status === 'completed' && (
                    <>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFile(categoryId, file.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
          ))}
        </div>
      )}

        {/* Upload Progress */}
        {files.some(f => f.status === 'uploading') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading files...</span>
              <span>
                {files.filter(f => f.status === 'completed').length} / {files.length}
              </span>
            </div>
            <Progress 
              value={
                (files.filter(f => f.status === 'completed').length / files.length) * 100
              } 
            />
        </div>
      )}
    </div>
  );
  };

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
              {documentCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  {category.icon}
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {documentCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {category.icon}
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  </div>
                  <UploadArea categoryId={category.id} />
                </div>
            </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeProfile;
