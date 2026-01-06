import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  School,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Upload,
  FileText,
  Image,
  X,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";

/* ================= SCHEMA ================= */

const registrationSchema = z.object({
  parentName: z.string().min(3),
  parentEmail: z.string().email(),
  parentPhone: z.string().min(10),
  parentAddress: z.string().min(10),

  studentName: z.string().min(3),
  birthPlace: z.string().min(2),
  birthDate: z.string(),
  gender: z.string(),
  previousSchool: z.string().optional(),

  institution: z.string().min(1),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

type DocumentKey = "kk" | "ktp" | "ijazah" | "photo" | "buktiTransfer";

interface DocumentFile {
  file: File;
  preview: string;
}

type Documents = Record<DocumentKey, DocumentFile | null>;

const institutions = [
  { id: "dta", name: "DTA Arrasyd" },
  { id: "smp", name: "SMP Baet El Anshar" },
  { id: "sma", name: "SMA Baet El Anshar" },
  { id: "pesantren", name: "Pesantren Tahfidz Quran" },
];

const documentTypes: { key: DocumentKey; label: string; icon: any }[] = [
  { key: "kk", label: "Kartu Keluarga", icon: FileText },
  { key: "ktp", label: "KTP Orang Tua", icon: FileText },
  { key: "ijazah", label: "Ijazah / SKL", icon: FileText },
  { key: "photo", label: "Pas Foto", icon: Image },
  { key: "buktiTransfer", label: "Bukti Transfer", icon: FileText },
];

/* ================= COMPONENT ================= */

export default function Registration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [documents, setDocuments] = useState<Documents>({
    kk: null,
    ktp: null,
    ijazah: null,
    photo: null,
    buktiTransfer: null,
  });

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
  });

  /* ================= DOCUMENT ================= */

  const handleFile = (key: DocumentKey, file: File) => {
    setDocuments((prev) => ({
      ...prev,
      [key]: { file, preview: URL.createObjectURL(file) },
    }));
  };

  const removeFile = (key: DocumentKey) => {
    setDocuments((prev) => ({ ...prev, [key]: null }));
  };

  const uploadDocuments = async (email: string) => {
    const result: Record<string, string> = {};
    const folder = email.replace(/[^a-z0-9]/gi, "_");

    for (const [key, value] of Object.entries(documents)) {
      if (!value) continue;

      const ext = value.file.name.split(".").pop();
      const path = `${folder}/${key}.${ext}`;

      const { error } = await supabase.storage
        .from("registration-documents")
        .upload(path, value.file, { upsert: true });

      if (error) throw error;
      result[key] = path;
    }

    return result;
  };

  /* ================= SUBMIT ================= */

  const onSubmit = async (data: RegistrationForm) => {
    try {
      setLoading(true);

      const docs = await uploadDocuments(data.parentEmail);

      const { error } = await supabase.functions.invoke("register-student", {
        body: {
          parent: {
            name: data.parentName,
            email: data.parentEmail,
            phone: data.parentPhone,
            address: data.parentAddress,
          },
          student: {
            name: data.studentName,
            birth_place: data.birthPlace,
            birth_date: data.birthDate,
            gender: data.gender,
            previous_school: data.previousSchool,
          },
          institution_id: data.institution,
          documents: docs,
        },
      });

      if (error) throw error;

      toast.success("Pendaftaran berhasil");
      navigate("/login");
    } catch (e: any) {
      toast.error(e.message ?? "Gagal mendaftar");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <Layout>
      <section className="py-16">
        <div className="max-w-2xl mx-auto bg-card p-8 rounded-xl">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {step === 1 && (
              <>
                <h2 className="text-xl font-bold flex gap-2">
                  <User /> Data Wali
                </h2>
                <Input placeholder="Nama Wali" {...form.register("parentName")} />
                <Input placeholder="Email" {...form.register("parentEmail")} />
                <Input placeholder="No HP" {...form.register("parentPhone")} />
                <Textarea placeholder="Alamat" {...form.register("parentAddress")} />
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl font-bold flex gap-2">
                  <GraduationCap /> Data Santri
                </h2>
                <Input placeholder="Nama Santri" {...form.register("studentName")} />
                <Input placeholder="Tempat Lahir" {...form.register("birthPlace")} />
                <Input type="date" {...form.register("birthDate")} />

                <RadioGroup
                  onValueChange={(v) => form.setValue("gender", v)}
                  className="flex gap-4"
                >
                  <RadioGroupItem value="laki-laki" /> Laki-laki
                  <RadioGroupItem value="perempuan" /> Perempuan
                </RadioGroup>

                <Input
                  placeholder="Asal Sekolah"
                  {...form.register("previousSchool")}
                />
              </>
            )}

            {step === 3 && (
              <>
                <Label>Lembaga</Label>
                <Select
                  onValueChange={(v) => form.setValue("institution", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih lembaga" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="text-xl font-bold flex gap-2">
                  <Upload /> Dokumen
                </h2>

                {documentTypes.map((d) => (
                  <div key={d.key}>
                    <Label>{d.label}</Label>
                    {documents[d.key] ? (
                      <div className="flex gap-2">
                        <span>{documents[d.key]!.file.name}</span>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeFile(d.key)}
                        >
                          <X />
                        </Button>
                      </div>
                    ) : (
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          e.target.files &&
                          handleFile(d.key, e.target.files[0])
                        }
                      />
                    )}
                  </div>
                ))}
              </>
            )}

            <div className="flex justify-between">
              {step > 1 && (
                <Button type="button" onClick={() => setStep(step - 1)}>
                  <ArrowLeft /> Kembali
                </Button>
              )}

              {step < 4 ? (
                <Button type="button" onClick={() => setStep(step + 1)}>
                  Lanjut <ArrowRight />
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : "Daftar"}
                </Button>
              )}
            </div>

          </form>
        </div>
      </section>
    </Layout>
  );
}
