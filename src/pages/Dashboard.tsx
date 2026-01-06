import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Award,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  KeyRound,
  Video,
  ExternalLink,
  Calendar
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

import Layout from "@/components/layout/Layout";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/* =======================
   TYPES
======================= */

interface Student {
  id: string;
  full_name: string;
}

interface Registration {
  id: string;
  student_id: string;
  status: "pending" | "document_review" | "interview" | "accepted" | "rejected";
  created_at: string;
  revision_notes?: string | null;
  interview_date?: string | null;
  interview_link?: string | null;
  interview_notes?: string | null;
  documents?: any;
}

interface HafalanProgress {
  id: string;
  surah_name: string;
  juz: number;
  status: string;
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

/* =======================
   COMPONENT
======================= */

export default function Dashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [hafalan, setHafalan] = useState<HafalanProgress[]>([]);
  const [academics, setAcademics] = useState<AcademicRecord[]>([]);
  const [profile, setProfile] = useState<{ full_name: string } | null>(null);

  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* =======================
     AUTH & FETCH
  ======================= */

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate("/login");
      } else {
        fetchData();
      }
    });
  }, []);

  const fetchData = async () => {
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", auth.user.id)
        .single();

      setProfile(profileData);

      const { data: studentsData } = await supabase
        .from("students")
        .select("*")
        .eq("parent_id", auth.user.id);

      if (!studentsData || studentsData.length === 0) {
        setStudents([]);
        return;
      }

      setStudents(studentsData);
      setSelectedStudent(studentsData[0].id);

      const studentIds = studentsData.map(s => s.id);

      const { data: regData } = await supabase
        .from("registrations")
        .select("*")
        .in("student_id", studentIds);

      setRegistrations(regData || []);

      const { data: hafalanData } = await supabase
        .from("hafalan_progress")
        .select("*")
        .in("student_id", studentIds);

      setHafalan(hafalanData || []);

      const { data: academicData } = await supabase
        .from("academic_records")
        .select("*")
        .in("student_id", studentIds);

      setAcademics(academicData || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat dashboard");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     FILTER DATA
  ======================= */

  const filteredRegistrations = useMemo(() => {
    if (!selectedStudent) return [];
    return registrations.filter(r => r.student_id === selectedStudent);
  }, [registrations, selectedStudent]);

  /* =======================
     HELPERS
  ======================= */

  const getStatusBadge = (status: string) => {
    const map: any = {
      pending: ["Menunggu Review", Clock, "bg-yellow-100 text-yellow-700"],
      document_review: ["Review Dokumen", AlertCircle, "bg-blue-100 text-blue-700"],
      interview: ["Wawancara", User, "bg-purple-100 text-purple-700"],
      accepted: ["Diterima", CheckCircle, "bg-green-100 text-green-700"],
      rejected: ["Ditolak", AlertCircle, "bg-red-100 text-red-700"]
    };

    const [label, Icon, cls] = map[status] || map.pending;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${cls}`}>
        <Icon className="w-3 h-3" /> {label}
      </span>
    );
  };

  /* =======================
     RENDER
  ======================= */

  if (loading) {
    return (
      <Layout>
        <div className="h-[60vh] flex items-center justify-center">
          <p>Memuat data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container py-10">
        <h1 className="text-3xl font-bold mb-2">
          Dashboard Wali Santri
        </h1>
        <p className="text-muted-foreground mb-6">
          Assalamu’alaikum, {profile?.full_name}
        </p>

        {students.length > 1 && (
          <div className="mb-6 flex gap-2">
            {students.map(s => (
              <Button
                key={s.id}
                size="sm"
                variant={selectedStudent === s.id ? "default" : "outline"}
                onClick={() => setSelectedStudent(s.id)}
              >
                {s.full_name}
              </Button>
            ))}
          </div>
        )}

        <Tabs defaultValue="registrations">
          <TabsList>
            <TabsTrigger value="registrations">Pendaftaran</TabsTrigger>
            <TabsTrigger value="hafalan">Hafalan</TabsTrigger>
            <TabsTrigger value="academics">Akademik</TabsTrigger>
          </TabsList>

          <TabsContent value="registrations">
            {filteredRegistrations.length === 0 ? (
              <p className="text-muted-foreground mt-6">
                Belum ada pendaftaran
              </p>
            ) : (
              filteredRegistrations.map(reg => (
                <Card key={reg.id} className="mt-4">
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex justify-between">
                      <p className="font-semibold">
                        #{reg.id.slice(0, 8)}
                      </p>
                      {getStatusBadge(reg.status)}
                    </div>

                    {reg.revision_notes && (
                      <div className="bg-orange-50 border p-4 rounded">
                        <p className="font-medium">Catatan Revisi</p>
                        <p className="text-sm mt-1">
                          {reg.revision_notes}
                        </p>
                        <Button
                          size="sm"
                          className="mt-3"
                          onClick={() =>
                            navigate(`/pendaftaran?mode=revision&id=${reg.id}`)
                          }
                        >
                          Upload Ulang Dokumen
                        </Button>
                      </div>
                    )}

                    {reg.status === "interview" && reg.interview_link && (
                      <a
                        href={reg.interview_link}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-purple-600"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Gabung Wawancara
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </section>
    </Layout>
  );
}
