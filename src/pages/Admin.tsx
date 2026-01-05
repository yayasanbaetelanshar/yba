import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, BookOpen, Award, FileText, LogOut, 
  CheckCircle, XCircle, Clock, Plus, Search, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import DocumentViewerDialog from "@/components/admin/DocumentViewerDialog";
import RevisionDialog from "@/components/admin/RevisionDialog";
import InterviewDialog from "@/components/admin/InterviewDialog";



interface Document {
  name: string;
  path: string;
  type: string;
}

interface Student {
  id: string;
  full_name: string;
  birth_date?: string;
  gender?: string;
  parent_id?: string;
  institution_id?: string;
}

interface Registration {
  id: string;
  student_id: string;
  institution_id: string;
  status: "pending" | "document_review" | "interview" | "accepted" | "rejected";
  created_at: string;
  notes: string | null;
  documents: Document[] | null;
  revision_notes: string | null;
  interview_date: string | null;
  interview_link: string | null;
  interview_notes: string | null;
  students?: { id: string; full_name: string; gender?: string };
}

interface HafalanProgress {
  id: string;
  student_id: string;
  surah_name: string;
  juz: number | null;
  status: string | null;
  teacher_notes: string | null;
  memorized_date: string | null;
  students?: { id: string; full_name: string };
}

interface AcademicRecord {
  id: string;
  student_id: string;
  subject: string;
  semester: number;
  academic_year: string;
  score: number | null;
  grade: string | null;
  students?: { id: string; full_name: string };
}

const statusOptions = [
  { value: "pending", label: "Menunggu Review" },
  { value: "document_review", label: "Review Dokumen" },
  { value: "interview", label: "Wawancara" },
  { value: "accepted", label: "Diterima" },
  { value: "rejected", label: "Ditolak" },
];

export default function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("registrations");
  
  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [hafalanList, setHafalanList] = useState<HafalanProgress[]>([]);
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal states
  const [isHafalanModalOpen, setIsHafalanModalOpen] = useState(false);
  const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  
  // Form states for hafalan
  const [hafalanForm, setHafalanForm] = useState({
    surah_name: "",
    juz: 1,
    status: "in_progress",
    teacher_notes: "",
  });
  
  // Form states for academic
  const [academicForm, setAcademicForm] = useState({
    subject: "",
    semester: 1,
    academic_year: "2024/2025",
    score: 0,
    grade: "",
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        navigate("/login");
        return;
      }

const { data: roleData, error } = await supabase
  .from("user_roles")
  .select("role")
  .eq("user_id", user.id)
  .maybeSingle();

if (error || roleData?.role !== "admin") {
  toast.error("Akses ditolak. Anda bukan admin.");
  navigate("/dashboard");
  return;
}

console.log("USER:", user.id);
console.log("ROLE:", roleData);

      setIsAdmin(true);
      fetchAllData();
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchStudents(),
      fetchRegistrations(),
      fetchHafalan(),
      fetchAcademics(),
    ]);
  };

  const fetchStudents = async () => {
    const { data } = await supabase
      .from("students")
      .select("*")
      .order("full_name");
    setStudents(data || []);
  };

  const fetchRegistrations = async () => {
    const { data } = await supabase
      .from("registrations")
      .select(`
        id,
        student_id,
        institution_id,
        status,
        created_at,
        notes,
        documents,
        revision_notes,
        interview_date,
        interview_link,
        interview_notes,
        students (id, full_name, gender)
      `)
      .order("created_at", { ascending: false });
    setRegistrations((data as unknown as Registration[]) || []);
  };

  const fetchHafalan = async () => {
    const { data } = await supabase
      .from("hafalan_progress")
      .select(`
        *,
        students (id, full_name)
      `)
      .order("created_at", { ascending: false });
    setHafalanList(data || []);
  };

  const fetchAcademics = async () => {
    const { data } = await supabase
      .from("academic_records")
      .select(`
        *,
        students (id, full_name)
      `)
      .order("created_at", { ascending: false });
    setAcademicRecords(data || []);
  };

  const updateRegistrationStatus = async (id: string, status: "pending" | "document_review" | "interview" | "accepted" | "rejected") => {
    try {
      const { error } = await supabase
        .from("registrations")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Status pendaftaran berhasil diubah");
      fetchRegistrations();
    } catch (error: any) {
      toast.error(error.message || "Gagal mengubah status");
    }
  };

  const addHafalanProgress = async () => {
    if (!selectedStudent) {
      toast.error("Pilih santri terlebih dahulu");
      return;
    }

    try {
      const { error } = await supabase
        .from("hafalan_progress")
        .insert({
          student_id: selectedStudent,
          surah_name: hafalanForm.surah_name,
          juz: hafalanForm.juz,
          status: hafalanForm.status,
          teacher_notes: hafalanForm.teacher_notes,
          memorized_date: hafalanForm.status === "completed" ? new Date().toISOString() : null,
        });

      if (error) throw error;

      toast.success("Progress hafalan berhasil ditambahkan");
      setIsHafalanModalOpen(false);
      setHafalanForm({ surah_name: "", juz: 1, status: "in_progress", teacher_notes: "" });
      setSelectedStudent("");
      fetchHafalan();
    } catch (error: any) {
      toast.error(error.message || "Gagal menambahkan hafalan");
    }
  };

  const addAcademicRecord = async () => {
    if (!selectedStudent) {
      toast.error("Pilih santri terlebih dahulu");
      return;
    }

    try {
      const { error } = await supabase
        .from("academic_records")
        .insert({
          student_id: selectedStudent,
          subject: academicForm.subject,
          semester: academicForm.semester,
          academic_year: academicForm.academic_year,
          score: academicForm.score,
          grade: academicForm.grade,
        });

      if (error) throw error;

      toast.success("Nilai akademik berhasil ditambahkan");
      setIsAcademicModalOpen(false);
      setAcademicForm({ subject: "", semester: 1, academic_year: "2024/2025", score: 0, grade: "" });
      setSelectedStudent("");
      fetchAcademics();
    } catch (error: any) {
      toast.error(error.message || "Gagal menambahkan nilai");
    }
  };

  const updateHafalanStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("hafalan_progress")
        .update({ 
          status,
          memorized_date: status === "completed" ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Status hafalan berhasil diubah");
      fetchHafalan();
    } catch (error: any) {
      toast.error(error.message || "Gagal mengubah status");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any }> = {
      pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
      document_review: { color: "bg-blue-100 text-blue-700", icon: FileText },
      interview: { color: "bg-purple-100 text-purple-700", icon: Users },
      accepted: { color: "bg-green-100 text-green-700", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-700", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    const label = statusOptions.find(s => s.value === status)?.label || status;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
    );
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch = reg.students?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || reg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Memeriksa akses admin...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">
          Anda tidak memiliki akses admin
        </p>
      </div>
    </Layout>
  );
}


  return (
    <Layout>
      <section className="py-12 lg:py-16 min-h-screen bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground">
                Panel Admin
              </h1>
              <p className="text-muted-foreground mt-1">
                Kelola pendaftaran, hafalan, dan nilai akademik santri
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Santri</p>
                    <p className="text-2xl font-bold text-foreground">{students.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-foreground">
                      {registrations.filter(r => r.status === "pending").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Diterima</p>
                    <p className="text-2xl font-bold text-foreground">
                      {registrations.filter(r => r.status === "accepted").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hafalan Selesai</p>
                    <p className="text-2xl font-bold text-foreground">
                      {hafalanList.filter(h => h.status === "completed").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="registrations" className="gap-2">
                <FileText className="w-4 h-4" />
                Pendaftaran
              </TabsTrigger>
              <TabsTrigger value="hafalan" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Progress Hafalan
              </TabsTrigger>
              <TabsTrigger value="academics" className="gap-2">
                <Award className="w-4 h-4" />
                Nilai Akademik
              </TabsTrigger>
            </TabsList>

            {/* Registrations Tab */}
            <TabsContent value="registrations">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <CardTitle className="font-serif">Daftar Pendaftaran</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Cari nama santri..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-40">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Status</SelectItem>
                          {statusOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredRegistrations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Tidak ada data pendaftaran
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 text-sm font-semibold">Nama Santri</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Tanggal Daftar</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Dokumen & Aksi</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Ubah Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRegistrations.map((reg) => (
                            <tr key={reg.id} className="border-b border-border hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <p className="font-medium text-foreground">
                                  {reg.students?.full_name || "N/A"}
                                </p>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {new Date(reg.created_at).toLocaleDateString("id-ID")}
                              </td>
                              <td className="py-3 px-4">
                                {getStatusBadge(reg.status)}
                                {reg.revision_notes && (
                                  <p className="text-xs text-orange-600 mt-1">Ada catatan revisi</p>
                                )}
                                {reg.interview_date && (
                                  <p className="text-xs text-purple-600 mt-1">
                                    Wawancara: {new Date(reg.interview_date).toLocaleString("id-ID")}
                                  </p>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-2">
                                  <DocumentViewerDialog 
                                    documents={reg.documents || []} 
                                    studentName={reg.students?.full_name || "N/A"} 
                                  />
                                  <RevisionDialog 
                                    registrationId={reg.id} 
                                    studentName={reg.students?.full_name || "N/A"} 
                                    currentNotes={reg.revision_notes}
                                    onUpdate={fetchRegistrations}
                                  />
                                  <InterviewDialog 
                                    registrationId={reg.id} 
                                    studentName={reg.students?.full_name || "N/A"} 
                                    currentDate={reg.interview_date}
                                    currentLink={reg.interview_link}
                                    currentNotes={reg.interview_notes}
                                    onUpdate={fetchRegistrations}
                                  />
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Select
                                  value={reg.status}
                                  onValueChange={(value) => updateRegistrationStatus(reg.id, value as "pending" | "document_review" | "interview" | "accepted" | "rejected")}
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {statusOptions.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Hafalan Tab */}
            <TabsContent value="hafalan">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <CardTitle className="font-serif">Progress Hafalan Al-Quran</CardTitle>
                    <Dialog open={isHafalanModalOpen} onOpenChange={setIsHafalanModalOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Hafalan
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="font-serif">Tambah Progress Hafalan</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label>Pilih Santri</Label>
                            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih santri" />
                              </SelectTrigger>
                              <SelectContent>
                                {students.map((s) => (
                                  <SelectItem key={s.id} value={s.id}>
                                    {s.full_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Nama Surah</Label>
                            <Input
                              placeholder="Contoh: Al-Baqarah"
                              value={hafalanForm.surah_name}
                              onChange={(e) => setHafalanForm({ ...hafalanForm, surah_name: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Juz</Label>
                              <Input
                                type="number"
                                min={1}
                                max={30}
                                value={hafalanForm.juz}
                                onChange={(e) => setHafalanForm({ ...hafalanForm, juz: parseInt(e.target.value) })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <Select
                                value={hafalanForm.status}
                                onValueChange={(value) => setHafalanForm({ ...hafalanForm, status: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="in_progress">Dalam Proses</SelectItem>
                                  <SelectItem value="completed">Selesai</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Catatan Guru</Label>
                            <Textarea
                              placeholder="Catatan tambahan..."
                              value={hafalanForm.teacher_notes}
                              onChange={(e) => setHafalanForm({ ...hafalanForm, teacher_notes: e.target.value })}
                            />
                          </div>
                          <Button onClick={addHafalanProgress} className="w-full">
                            Simpan
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {hafalanList.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Belum ada data hafalan
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 text-sm font-semibold">Santri</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Surah</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Juz</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Catatan</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hafalanList.map((h) => (
                            <tr key={h.id} className="border-b border-border hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">{h.students?.full_name || "N/A"}</td>
                              <td className="py-3 px-4">{h.surah_name}</td>
                              <td className="py-3 px-4">{h.juz}</td>
                              <td className="py-3 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  h.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}>
                                  {h.status === "completed" ? "Selesai" : "Dalam Proses"}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground text-sm max-w-xs truncate">
                                {h.teacher_notes || "-"}
                              </td>
                              <td className="py-3 px-4">
                                <Select
                                  value={h.status}
                                  onValueChange={(value) => updateHafalanStatus(h.id, value)}
                                >
                                  <SelectTrigger className="w-36">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="in_progress">Dalam Proses</SelectItem>
                                    <SelectItem value="completed">Selesai</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Academics Tab */}
            <TabsContent value="academics">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <CardTitle className="font-serif">Nilai Akademik Santri</CardTitle>
                    <Dialog open={isAcademicModalOpen} onOpenChange={setIsAcademicModalOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Nilai
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="font-serif">Tambah Nilai Akademik</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label>Pilih Santri</Label>
                            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih santri" />
                              </SelectTrigger>
                              <SelectContent>
                                {students.map((s) => (
                                  <SelectItem key={s.id} value={s.id}>
                                    {s.full_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Mata Pelajaran</Label>
                            <Input
                              placeholder="Contoh: Matematika"
                              value={academicForm.subject}
                              onChange={(e) => setAcademicForm({ ...academicForm, subject: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Semester</Label>
                              <Select
                                value={academicForm.semester.toString()}
                                onValueChange={(value) => setAcademicForm({ ...academicForm, semester: parseInt(value) })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">Semester 1</SelectItem>
                                  <SelectItem value="2">Semester 2</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Tahun Ajaran</Label>
                              <Input
                                placeholder="2024/2025"
                                value={academicForm.academic_year}
                                onChange={(e) => setAcademicForm({ ...academicForm, academic_year: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Nilai</Label>
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                value={academicForm.score}
                                onChange={(e) => setAcademicForm({ ...academicForm, score: parseInt(e.target.value) })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Grade</Label>
                              <Select
                                value={academicForm.grade}
                                onValueChange={(value) => setAcademicForm({ ...academicForm, grade: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih grade" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="A">A</SelectItem>
                                  <SelectItem value="B">B</SelectItem>
                                  <SelectItem value="C">C</SelectItem>
                                  <SelectItem value="D">D</SelectItem>
                                  <SelectItem value="E">E</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button onClick={addAcademicRecord} className="w-full">
                            Simpan
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {academicRecords.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Belum ada data nilai akademik
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 text-sm font-semibold">Santri</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Mata Pelajaran</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Semester</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Tahun Ajaran</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Nilai</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {academicRecords.map((record) => (
                            <tr key={record.id} className="border-b border-border hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">{record.students?.full_name || "N/A"}</td>
                              <td className="py-3 px-4">{record.subject}</td>
                              <td className="py-3 px-4">{record.semester}</td>
                              <td className="py-3 px-4">{record.academic_year}</td>
                              <td className="py-3 px-4 font-semibold">{record.score}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  record.grade === "A" ? "bg-green-100 text-green-700" :
                                  record.grade === "B" ? "bg-blue-100 text-blue-700" :
                                  record.grade === "C" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-red-100 text-red-700"
                                }`}>
                                  {record.grade}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}