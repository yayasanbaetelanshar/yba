import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, BookOpen, Award, LogOut, GraduationCap, Clock, CheckCircle, AlertCircle, KeyRound, Video, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";

interface Student {
  id: string;
  full_name: string;
  institution_id: string;
  gender: string;
}

interface Registration {
  id: string;
  student_id: string;
  institution_id: string;
  status: "pending" | "document_review" | "interview" | "accepted" | "rejected";
  notes: string | null;

  // TAMBAHAN — OPTIONAL
  revision_notes?: string | null;
  interview_date?: string | null;
  interview_link?: string | null;
  interview_notes?: string | null;

  documents?: any;
  created_at: string;
  updated_at?: string;

  students?: {
    id: string;
    full_name: string;
    gender?: string;
  };
}


interface HafalanProgress {
  id: string;
  surah_name: string;
  juz: number;
  status: string;
  memorized_date: string;
  teacher_notes: string;
}

interface AcademicRecord {
  id: string;
  subject: string;
  semester: number;
  academic_year: string;
  score: number;
  grade: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [hafalan, setHafalan] = useState<HafalanProgress[]>([]);
  const [academics, setAcademics] = useState<AcademicRecord[]>([]);
  const [profile, setProfile] = useState<{ full_name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        fetchData();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      // Fetch students
      const { data: studentsData } = await supabase
        .from("students")
        .select("*")
        .eq("parent_id", user.id);
      setStudents(studentsData || []);

      if (studentsData && studentsData.length > 0) {
        setSelectedStudent(studentsData[0].id);

        // Fetch registrations
        const { data: regData } = await supabase
          .from("registrations")
          .select("*")
          .in("student_id", studentsData.map(s => s.id));
        setRegistrations(regData || []);

        // Fetch hafalan progress
        const { data: hafalanData } = await supabase
          .from("hafalan_progress")
          .select("*")
          .in("student_id", studentsData.map(s => s.id))
          .order("created_at", { ascending: false });
        setHafalan(hafalanData || []);

        // Fetch academic records
        const { data: academicsData } = await supabase
          .from("academic_records")
          .select("*")
          .in("student_id", studentsData.map(s => s.id))
          .order("semester", { ascending: false });
        setAcademics(academicsData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil keluar");
    navigate("/login");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock, label: "Menunggu Review" },
      document_review: { color: "bg-blue-100 text-blue-700", icon: AlertCircle, label: "Review Dokumen" },
      interview: { color: "bg-purple-100 text-purple-700", icon: User, label: "Tahap Wawancara" },
      accepted: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Diterima" },
      rejected: { color: "bg-red-100 text-red-700", icon: AlertCircle, label: "Ditolak" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 lg:py-16 islamic-pattern min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground">
                Dashboard Wali Santri
              </h1>
              <p className="text-muted-foreground mt-1">
                Assalamu'alaikum, {profile?.full_name || "Wali Santri"}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => navigate("/pendaftaran")}>
                <GraduationCap className="w-4 h-4 mr-2" />
                Daftar Santri Baru
              </Button>
              <ChangePasswordDialog>
                <Button variant="outline">
                  <KeyRound className="w-4 h-4 mr-2" />
                  Ganti Password
                </Button>
              </ChangePasswordDialog>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>

          {students.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Belum Ada Santri Terdaftar</h3>
                <p className="text-muted-foreground mb-6">
                  Daftarkan putra-putri Anda untuk mulai melihat perkembangan mereka.
                </p>
                <Button onClick={() => navigate("/pendaftaran")}>
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Daftar Sekarang
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Student Selector */}
              {students.length > 1 && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Pilih Santri:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {students.map((student) => (
                      <Button
                        key={student.id}
                        variant={selectedStudent === student.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedStudent(student.id)}
                      >
                        {student.full_name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-primary" />
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
                      <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Hafalan Selesai</p>
                        <p className="text-2xl font-bold text-foreground">
                          {hafalan.filter(h => h.status === "completed").length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                        <Award className="w-6 h-6 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rata-rata Nilai</p>
                        <p className="text-2xl font-bold text-foreground">
                          {academics.length > 0
                            ? (academics.reduce((a, b) => a + (b.score || 0), 0) / academics.length).toFixed(1)
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <Tabs defaultValue="registrations" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="registrations">Status Pendaftaran</TabsTrigger>
                  <TabsTrigger value="hafalan">Progress Hafalan</TabsTrigger>
                  <TabsTrigger value="academics">Nilai Akademik</TabsTrigger>
                </TabsList>

                <TabsContent value="registrations">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif">Status Pendaftaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {registrations.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          Belum ada pendaftaran
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {registrations.map((reg) => (
                            <div
                              key={reg.id}
                              className="p-4 bg-muted rounded-xl space-y-4"
                            >
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                  <p className="font-semibold text-foreground">
                                    Pendaftaran #{reg.id.slice(0, 8)}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Didaftarkan: {new Date(reg.created_at).toLocaleDateString("id-ID")}
                                  </p>
                                </div>
                                {getStatusBadge(reg.status)}
                              </div>

                              {/* Revision Notes Alert */}
                              {reg.revision_notes && (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                  <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                                    <div>
                                      <h4 className="font-medium text-orange-800">Catatan Revisi dari Admin</h4>
                                      <p className="text-sm text-orange-700 mt-1 whitespace-pre-line">
                                        {reg.revision_notes}
                                      </p>
                                      <p className="text-xs text-orange-600 mt-2">
                                        Mohon perbaiki dokumen dan dan kirim ke nomor 085975213222
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Interview Invitation */}
                              {reg.status === "interview" && reg.interview_date && reg.interview_link && (
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                  <div className="flex items-start gap-3">
                                    <Video className="w-5 h-5 text-purple-500 mt-0.5" />
                                    <div className="flex-1">
                                      <h4 className="font-medium text-purple-800">Undangan Wawancara Online</h4>
                                      <div className="mt-3 space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-purple-700">
                                          <Calendar className="w-4 h-4" />
                                          <span className="font-medium">Jadwal:</span>
                                          {new Date(reg.interview_date).toLocaleString("id-ID", {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </div>
                                        <a 
                                          href={reg.interview_link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                        >
                                          <ExternalLink className="w-4 h-4" />
                                          Gabung Meeting
                                        </a>
                                        {reg.interview_notes && (
                                          <p className="text-sm text-purple-700 mt-2">
                                            <span className="font-medium">Catatan:</span> {reg.interview_notes}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="hafalan">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif">Progress Hafalan Al-Quran</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {hafalan.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          Belum ada data hafalan
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {hafalan.map((h) => (
                            <div
                              key={h.id}
                              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-muted rounded-xl"
                            >
                              <div>
                                <p className="font-semibold text-foreground">
                                  {h.surah_name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Juz {h.juz} • {h.teacher_notes || "Dalam proses"}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  h.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {h.status === "completed" ? "Selesai" : "Dalam Proses"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>


                <TabsContent value="academics">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif">Nilai Akademik</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {academics.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          Belum ada data nilai akademik
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                                  Mata Pelajaran
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                                  Semester
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                                  Tahun Ajaran
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                                  Nilai
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                                  Grade
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {academics.map((record) => (
                                <tr key={record.id} className="border-b border-border">
                                  <td className="py-3 px-4 text-foreground">{record.subject}</td>
                                  <td className="py-3 px-4 text-muted-foreground">{record.semester}</td>
                                  <td className="py-3 px-4 text-muted-foreground">{record.academic_year}</td>
                                  <td className="py-3 px-4 font-semibold text-foreground">{record.score}</td>
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
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}