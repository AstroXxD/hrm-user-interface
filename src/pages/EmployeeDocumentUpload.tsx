import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileText, 
  Image, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Download,
  Eye,
  Trash2,
  ArrowLeft,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  status: 'uploading' | 'completed' | 'error';
}

interface DocumentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  acceptedTypes: string[];
  maxSize: number; // in MB
  required: boolean;
}

const EmployeeDocumentUpload = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  // Mock employee data
  const employee = {
    id: id || 'E001',
    name: 'John Doe',
    position: 'Software Engineer',
    department: 'Engineering',
    email: 'john.doe@company.com'
  };

  const documentCategories: DocumentCategory[] = [
    {
      id: 'resume',
      name: 'Resume/CV',
      icon: <FileText className="w-5 h-5" />,
      description: 'Upload your latest resume or CV',
      acceptedTypes: ['.pdf', '.doc', '.docx'],
      maxSize: 5,
      required: true
    },
    {
      id: 'id',
      name: 'ID Documents',
      icon: <Image className="w-5 h-5" />,
      description: 'Government issued ID, passport, or driver\'s license',
      acceptedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
      maxSize: 10,
      required: true
    },
    {
      id: 'certificates',
      name: 'Certificates',
      icon: <Award className="w-5 h-5" />,
      description: 'Professional certificates, degrees, and qualifications',
      acceptedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
      maxSize: 10,
      required: false
    }
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        status: 'uploading'
      };

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          clearInterval(interval);
          uploadedFile.status = 'completed';
          resolve(uploadedFile);
        }
      }, 200);
    });
  };

  const handleFiles = useCallback(async (files: FileList, categoryId: string) => {
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
      status: 'uploading' as const
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
  }, [documentCategories, toast]);

  const handleDrag = useCallback((e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(prev => ({ ...prev, [categoryId]: true }));
    } else if (e.type === "dragleave") {
      setDragActive(prev => ({ ...prev, [categoryId]: false }));
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [categoryId]: false }));
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files, categoryId);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>, categoryId: string) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files, categoryId);
    }
  }, [handleFiles]);

  const removeFile = (categoryId: string, fileId: string) => {
    setUploadingFiles(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].filter(f => f.id !== fileId)
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/dashboard/employees')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Document Upload</h1>
            <p className="text-muted-foreground">
              Manage documents for {employee.name}
            </p>
          </div>
        </div>
      </div>

      {/* Employee Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Employee Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg">{employee.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Position</p>
              <p className="text-lg">{employee.position}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Department</p>
              <p className="text-lg">{employee.department}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Tabs */}
      <Tabs defaultValue="resume" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          {documentCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              {category.icon}
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {documentCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {category.icon}
                  {category.name}
                </CardTitle>
                <CardDescription>
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive[category.id]
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                  onDragEnter={(e) => handleDrag(e, category.id)}
                  onDragLeave={(e) => handleDrag(e, category.id)}
                  onDragOver={(e) => handleDrag(e, category.id)}
                  onDrop={(e) => handleDrop(e, category.id)}
                >
                  <input
                    type="file"
                    multiple
                    accept={category.acceptedTypes.join(',')}
                    onChange={(e) => handleFileInput(e, category.id)}
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
                {uploadingFiles[category.id].length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Uploaded Files</h4>
                    {uploadingFiles[category.id].map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(file.status)}
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(file.status)}>
                            {file.status}
                          </Badge>
                          
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
                            onClick={() => removeFile(category.id, file.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Progress */}
                {uploadingFiles[category.id].some(f => f.status === 'uploading') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading files...</span>
                      <span>
                        {uploadingFiles[category.id].filter(f => f.status === 'completed').length} / {uploadingFiles[category.id].length}
                      </span>
                    </div>
                    <Progress 
                      value={
                        (uploadingFiles[category.id].filter(f => f.status === 'completed').length / 
                         uploadingFiles[category.id].length) * 100
                      } 
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Summary</CardTitle>
          <CardDescription>
            Overview of document upload status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {documentCategories.map((category) => {
              const files = uploadingFiles[category.id];
              const completedFiles = files.filter(f => f.status === 'completed');
              const hasRequired = category.required && completedFiles.length > 0;
              
              return (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {category.icon}
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {completedFiles.length} file(s) uploaded
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {completedFiles.length > 0 && (
                      <Badge variant="default">Complete</Badge>
                    )}
                    {completedFiles.length === 0 && (
                      <Badge variant="secondary">No files</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDocumentUpload;
