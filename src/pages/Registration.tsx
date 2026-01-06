import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, MapPin, Phone, Mail, GraduationCap, Calendar, School, ArrowLeft, ArrowRight, CheckCircle, Eye, EyeOff, Copy, Upload, FileText, Image, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";

const registrationSchema = z.object({
  // Parent info
  parentName: z.string().min(3, "Nama minimal 3 karakter"),
  parentEmail: z.string().email("Email tidak valid"),
  parentPhone: z.string().min(10, "Nomor telepon tidak valid"),
  parentAddress: z.string().min(10, "Alamat minimal 10 karakter"),
  // Student info
  studentName: z.string().min(3, "Nama minimal 3 karakter"),
  birthPlace: z.string().min(2, "Tempat lahir wajib diisi"),
  birthDate: z.string().min(1, "Tanggal lahir wajib diisi"),
  gender: z.string().min(1, "Jenis kelamin wajib dipilih"),
  previousSchool: z.string().optional(),
  // Institution
  institution: z.string().min(1, "Pilih lembaga pendidikan"),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

interface DocumentFile {
  file: File;
  preview: string;
  uploading: boolean;
  url?: string;
}

interface Documents {
  kk: DocumentFile | null;
  ktp: DocumentFile | null;
  ijazah: DocumentFile | null;
  photo: DocumentFile | null;
  buktiTransfer: DocumentFile | null;
}

const institutions = [
  { id: "dta", name: "DTA Arrasyd", level: "Tingkat Dasar" },
  { id: "smp", name: "SMP Baet El Anshar", level: "Tingkat Menengah Pertama" },
  { id: "sma", name: "SMA Baet El Anshar", level: "Tingkat Menengah Atas" },
  { id: "pesantren", name: "Pesantren Tahfidz Quran", level: "Program Tahfidz" },
];

interface RegistrationCredentials {
  email: string;
  password: string;
}

const documentTypes = [
  { key: "kk", label: "Kartu Keluarga (KK)", icon: FileText, required: true },
  { key: "ktp", label: "KTP Orang Tua", icon: FileText, required: true },
  { key: "ijazah", label: "Ijazah / SKL", icon: FileText, required: true },
  { key: "photo", label: "Pas Photo 3x4", icon: Image, required: true },
  { key: "buktiTransfer", label: "Bukti Transfer Pendaftaran", icon: FileText, required: true },
] as const;

export default function Registration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true);
  const [credentials, setCredentials] = useState<RegistrationCredentials | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [documents, setDocuments] = useState<Documents>({
    kk: null,
    ktp: null,
    ijazah: null,
    photo: null,
    buktiTransfer: null,
  });
  const [uploadingDocs, setUploadingDocs] = useState(false);

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      parentAddress: "",
      studentName: "",
      birthPlace: "",
      birthDate: "",
      gender: "",
      previousSchool: "",
      institution: "",
    },
  });

  const handleFileSelect = (key: keyof Documents, file: File) => {
    const preview = URL.createObjectURL(file);
    setDocuments(prev => ({
      ...prev,
      [key]: { file, preview, uploading: false }
    }));
  };

  const removeFile = (key: keyof Documents) => {
    if (documents[key]?.preview) {
      URL.revokeObjectURL(documents[key]!.preview);
    }
    setDocuments(prev => ({
      ...prev,
      [key]: null
    }));
  };

  const uploadDocuments = async (studentEmail: string): Promise<Record<string, string>> => {
    const uploadedUrls: Record<string, string> = {};
    const timestamp = Date.now();
    const sanitizedEmail = studentEmail.replace(/[^a-zA-Z0-9]/g, '_');

    for (const [key, doc] of Object.entries(documents)) {
      if (doc?.file) {
        const fileExt = doc.file.name.split('.').pop();
        const filePath = `${sanitizedEmail}/${key}_${timestamp}.${fileExt}`;
        
        const { error } = await supabase.storage
          .from('registration-documents')
          .upload(filePath, doc.file);

        if (error) {
          console.error(`Error uploading ${key}:`, error);
          throw new Error(`Gagal mengupload ${key}`);
        }

        uploadedUrls[key] = filePath;
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (data: RegistrationForm) => {
    // Validate all documents are uploaded
    const missingDocs = documentTypes.filter(dt => dt.required && !documents[dt.key]);
    if (missingDocs.length > 0) {
      toast.error(`Dokumen belum lengkap: ${missingDocs.map(d => d.label).join(', ')}`);
      return;
    }

    setIsLoading(true);
    setUploadingDocs(true);

    try {
      // Upload documents first
      const documentUrls = await uploadDocuments(data.parentEmail);
      setUploadingDocs(false);

      // Then register the student
      const { data: response, error } = await supabase.functions.invoke('register-student', {
        body: {
          ...data,
          documents: documentUrls
        }
      });

      if (error) throw error;
      
      if (!response.success) {
        throw new Error(response.message);
      }

      setCredentials(response.credentials);
      setIsNewUser(response.isNewUser);
      setIsSuccess(true);
      toast.success(response.message);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setUploadingDocs(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof RegistrationForm)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ["parentName", "parentEmail", "parentPhone", "parentAddress"];
    } else if (step === 2) {
      fieldsToValidate = ["studentName", "birthPlace", "birthDate", "gender"];
    } else if (step === 3) {
      fieldsToValidate = ["institution"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const allDocumentsUploaded = documentTypes.every(dt => !dt.required || documents[dt.key]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard");
  };

  if (isSuccess) {
    return (
      <Layout>
        <section className="min-h-[80vh] flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Pendaftaran Berhasil!
            </h1>
            <p className="text-muted-foreground mb-8">
              {isNewUser 
                ? "Akun wali santri telah dibuat. Simpan data login berikut untuk mengakses dashboard."
                : "Santri baru telah ditambahkan ke akun Anda. Silakan login dengan akun yang sudah ada untuk melihat status pendaftaran."
              }
            </p>
            
            {isNewUser && credentials ? (
              <div className="bg-card rounded-xl border border-border p-6 mb-8 text-left">
                <h3 className="font-semibold text-lg mb-4 text-center">Data Login Wali Santri</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <div className="flex items-center gap-2">
                      <Input value={credentials.email} readOnly className="bg-muted" />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(credentials.email)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Password</Label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={credentials.password}
                          readOnly
                          className="bg-muted pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(credentials.password)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-destructive mt-4 text-center">
                  ⚠️ Simpan data ini dengan baik. Password tidak dapat dilihat kembali.
                </p>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-6 mb-8">
                <p className="text-muted-foreground">
                  Santri baru telah terdaftar dan terhubung dengan akun wali yang sudah ada.
                </p>
              </div>
            )}
            
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/login")}>
                Login Sekarang
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                Kembali ke Beranda
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 lg:py-24 islamic-pattern">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
                Pendaftaran Santri Baru
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Formulir Pendaftaran
              </h1>
              <p className="text-muted-foreground">
                Lengkapi data berikut untuk mendaftarkan putra-putri Anda. Akun login akan otomatis dibuat.
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 md:gap-4 mb-12">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm md:text-base ${
                      step >= s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`w-8 md:w-12 h-1 rounded ${
                        step > s ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="bg-card rounded-2xl shadow-card p-8 border border-border">
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                {/* Step 1: Parent Info */}
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                      <User className="w-6 h-6 text-primary" />
                      <h2 className="font-serif text-xl font-bold">Data Wali Santri</h2>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentName">Nama Lengkap Wali</Label>
                      <Input
                        id="parentName"
                        placeholder="Masukkan nama lengkap"
                        {...form.register("parentName")}
                      />
                      {form.formState.errors.parentName && (
                        <p className="text-sm text-destructive">{form.formState.errors.parentName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentEmail">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="parentEmail"
                          type="email"
                          placeholder="email@contoh.com"
                          className="pl-10"
                          {...form.register("parentEmail")}
                        />
                      </div>
                      {form.formState.errors.parentEmail && (
                        <p className="text-sm text-destructive">{form.formState.errors.parentEmail.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Email ini akan digunakan untuk login ke dashboard wali santri
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentPhone">Nomor Telepon</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="parentPhone"
                          placeholder="08xxxxxxxxxx"
                          className="pl-10"
                          {...form.register("parentPhone")}
                        />
                      </div>
                      {form.formState.errors.parentPhone && (
                        <p className="text-sm text-destructive">{form.formState.errors.parentPhone.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentAddress">Alamat Lengkap</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Textarea
                          id="parentAddress"
                          placeholder="Masukkan alamat lengkap"
                          className="pl-10 min-h-[100px]"
                          {...form.register("parentAddress")}
                        />
                      </div>
                      {form.formState.errors.parentAddress && (
                        <p className="text-sm text-destructive">{form.formState.errors.parentAddress.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Student Info */}
                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                      <GraduationCap className="w-6 h-6 text-primary" />
                      <h2 className="font-serif text-xl font-bold">Data Calon Santri</h2>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="studentName">Nama Lengkap Calon Santri</Label>
                      <Input
                        id="studentName"
                        placeholder="Masukkan nama lengkap"
                        {...form.register("studentName")}
                      />
                      {form.formState.errors.studentName && (
                        <p className="text-sm text-destructive">{form.formState.errors.studentName.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="birthPlace">Tempat Lahir</Label>
                        <Input
                          id="birthPlace"
                          placeholder="Kota/Kabupaten"
                          {...form.register("birthPlace")}
                        />
                        {form.formState.errors.birthPlace && (
                          <p className="text-sm text-destructive">{form.formState.errors.birthPlace.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birthDate">Tanggal Lahir</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="birthDate"
                            type="date"
                            className="pl-10"
                            {...form.register("birthDate")}
                          />
                        </div>
                        {form.formState.errors.birthDate && (
                          <p className="text-sm text-destructive">{form.formState.errors.birthDate.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Jenis Kelamin</Label>
                      <RadioGroup
                        value={form.watch("gender")}
                        onValueChange={(value) => form.setValue("gender", value)}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="laki-laki" id="male" />
                          <Label htmlFor="male" className="font-normal">Laki-laki</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="perempuan" id="female" />
                          <Label htmlFor="female" className="font-normal">Perempuan</Label>
                        </div>
                      </RadioGroup>
                      {form.formState.errors.gender && (
                        <p className="text-sm text-destructive">{form.formState.errors.gender.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="previousSchool">Asal Sekolah (Opsional)</Label>
                      <div className="relative">
                        <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="previousSchool"
                          placeholder="Nama sekolah sebelumnya"
                          className="pl-10"
                          {...form.register("previousSchool")}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Institution Selection */}
                {step === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                      <GraduationCap className="w-6 h-6 text-primary" />
                      <h2 className="font-serif text-xl font-bold">Pilih Lembaga Pendidikan</h2>
                    </div>

                    <div className="space-y-2">
                      <Label>Lembaga yang Dituju</Label>
                      <Select
                        value={form.watch("institution")}
                        onValueChange={(value) => form.setValue("institution", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih lembaga pendidikan" />
                        </SelectTrigger>
                        <SelectContent>
                          {institutions.map((inst) => (
                            <SelectItem key={inst.id} value={inst.id}>
                              {inst.name} - {inst.level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.institution && (
                        <p className="text-sm text-destructive">{form.formState.errors.institution.message}</p>
                      )}
                    </div>

                    {form.watch("institution") && (
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <h4 className="font-semibold text-primary mb-2">
                          {institutions.find(i => i.id === form.watch("institution"))?.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {institutions.find(i => i.id === form.watch("institution"))?.level}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Document Upload */}
                {step === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                      <Upload className="w-6 h-6 text-primary" />
                      <h2 className="font-serif text-xl font-bold">Upload Dokumen</h2>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4">
                      Upload dokumen yang diperlukan dalam format JPG, PNG, atau PDF (maksimal 5MB per file).
                    </p>

                    <div className="space-y-4">
                      {documentTypes.map((docType) => {
                        const doc = documents[docType.key];
                        const IconComponent = docType.icon;

                        return (
                          <div key={docType.key} className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-5 h-5 text-muted-foreground" />
                                <Label className="font-medium">
                                  {docType.label}
                                  {docType.required && <span className="text-destructive ml-1">*</span>}
                                </Label>
                              </div>
                              {doc && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(docType.key)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>

                            {doc ? (
                              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                {doc.file.type.startsWith('image/') ? (
                                  <img
                                    src={doc.preview}
                                    alt={docType.label}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                ) : (
                                  <FileText className="w-12 h-12 text-primary" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{doc.file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                <span className="text-sm text-muted-foreground">
                                  Klik untuk upload atau drag & drop
                                </span>
                                <span className="text-xs text-muted-foreground mt-1">
                                  JPG, PNG, PDF (maks. 5MB)
                                </span>
                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      if (file.size > 5 * 1024 * 1024) {
                                        toast.error("Ukuran file maksimal 5MB");
                                        return;
                                      }
                                      handleFileSelect(docType.key, file);
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {!allDocumentsUploaded && (
                      <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                        ⚠️ Lengkapi semua dokumen yang wajib diupload untuk melanjutkan pendaftaran.
                      </p>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Sebelumnya
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/")}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Kembali
                    </Button>
                  )}

                  {step < 4 ? (
                    <Button type="button" onClick={nextStep}>
                      Selanjutnya
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading || !allDocumentsUploaded}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {uploadingDocs ? "Mengupload dokumen..." : "Mendaftarkan..."}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Daftar Sekarang
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
