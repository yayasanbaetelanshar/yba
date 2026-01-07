import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  GraduationCap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

/* ==================================================
   IMPORT FOTO (ASSETS)
================================================== */
// DTA
import fotoketuayayasan from "@/assets/organisasi/foto abah.webp";
import kepalaDtaImg from "@/assets/organisasi/ks dta.webp";
import sekretarisImg from "@/assets/organisasi/icon orang.webp";
import bendaharaImg from "@/assets/organisasi/icon orang.webp";

// SMP
import kepalaSmpImg from "@/assets/organisasi/ks smp.webp";
import gmpsmp1 from "@/assets/organisasi/icon orang.webp";
import gmpsmp2 from "@/assets/organisasi/icon orang.webp";
import gmpsmp3 from "@/assets/organisasi/icon orang.webp";
import gmpsmp4 from "@/assets/organisasi/icon orang.webp";
import gmpsmp5 from "@/assets/organisasi/icon orang.webp";
import gmpsmp6 from "@/assets/organisasi/icon orang.webp";
import gmpsmp7 from "@/assets/organisasi/icon orang.webp";
import gmpsmp8 from "@/assets/organisasi/icon orang.webp";
import gmpsmp9 from "@/assets/organisasi/icon orang.webp";
import gmpsmp10 from "@/assets/organisasi/icon orang.webp";
import gmpsmp11 from "@/assets/organisasi/icon orang.webp";

// SMA
import kepalaSmaImg from "@/assets/organisasi/ks sma.webp";
import gmp1 from "@/assets/organisasi/icon orang.webp";
import gmp2 from "@/assets/organisasi/icon orang.webp";
import gmp3 from "@/assets/organisasi/icon orang.webp";
import gmp4 from "@/assets/organisasi/icon orang.webp";
import gmp5 from "@/assets/organisasi/icon orang.webp";
import gmp6 from "@/assets/organisasi/icon orang.webp";
import gmp7 from "@/assets/organisasi/icon orang.webp";
import gmp8 from "@/assets/organisasi/icon orang.webp";
import gmp9 from "@/assets/organisasi/icon orang.webp";
import gmp10 from "@/assets/organisasi/icon orang.webp";
import gmp11 from "@/assets/organisasi/icon orang.webp";
import gmp12 from "@/assets/organisasi/icon orang.webp";

/* ==================================================
   TYPE
================================================== */
interface Organization {
  role: string;
  name: string;
  photo: string;
}

interface Institution {
  name: string;
  fullName: string;
  level: string;
  vision: string;
  mission: string[];
  history: string;
  organization: Organization[];
  description: string;
  curriculum: string[];
  facilities: string[];
  schedule: string;
  fees: {
    registration: number;
    monthly: number;
    annual: number;
  };
}

/* ==================================================
   DATA INSTITUSI
================================================== */
const institutionData: Record<string, Institution> = {
  dta: {
    name: "DTA Arrasyd",
    fullName: "Diniyah Takmiliyah Awaliyah Arrasyd",
    level: "Tingkat Dasar",
    vision:
      "Membentuk generasi Islami yang berakhlakul karimah, cinta Al-Qur’an, dan memiliki dasar keilmuan agama yang kuat.",
    mission: [
      "Menanamkan akidah dan akhlak mulia sejak usia dini",
      "Membiasakan ibadah harian sesuai tuntunan Islam",
      "Mengajarkan baca tulis Al-Qur’an dengan tajwid yang benar",
      "Menciptakan lingkungan belajar yang islami dan menyenangkan",
    ],
    history:
      "DTA Arrasyd didirikan sebagai bentuk kepedulian terhadap pentingnya pendidikan agama Islam sejak usia dini.",
    organization: [
      { role: "Ketua Yayasan", name: "KH. Harun Arrasyd", photo: fotoketuayayasan },
      { role: "Kepala DTA", name: "Ustz. Ade Tuti", photo: kepalaDtaImg },
      { role: "Sekretaris", name: "Ustz. Erviani Ramdani", photo: sekretarisImg },
      { role: "Bendahara", name: "Ustz. Erna", photo: bendaharaImg },
    ],
    description:
      "DTA Arrasyd merupakan lembaga pendidikan agama Islam tingkat dasar.",
    curriculum: [
      "Al-Quran dan Tajwid",
      "Hadits Pilihan",
      "Fiqih Ibadah",
      "Akidah Akhlak",
      "Sejarah Islam",
      "Bahasa Arab Dasar",
      "Doa dan Dzikir Harian",
    ],
    facilities: [
      "Ruang kelas yang nyaman",
      "Musholla",
      "Perpustakaan Islam",
      "Area bermain",
      "Kantin sehat",
    ],
    schedule: "Senin - Jumat, 14.00 - 15.00 WIB",
    fees: { registration: 50000, monthly: 20000, annual: 300000 },
  },

  smp: {
    name: "SMP Baet El Anshar",
    fullName: "Sekolah Menengah Pertama Arrasyd",
    level: "Tingkat Menengah Pertama",
    vision:
      "Mewujudkan peserta didik yang berprestasi, berakhlak mulia, dan berwawasan Islami.",
    mission: [
      "Menyelenggarakan pembelajaran efektif dan inovatif",
      "Menanamkan disiplin dan karakter Islami",
      "Mengembangkan potensi akademik dan non-akademik siswa",
    ],
    history:
      "SMP Baet El Anshar didirikan untuk melanjutkan pendidikan formal berbasis Islam setelah DTA.",
    organization: [
      { role: "Ketua Yayasan", name: "KH. Harun Arasyd", photo: fotoketuayayasan },
      { role: "Kepala Sekolah", name: "Ilham Syauqi Harun, S.Kom", photo: kepalaSmpImg },
      { role: "Guru Mapel BTQ", name: "Ade Tuti", photo: kepalaDtaImg },
      { role: "Guru Mapel PJOK", name: "Indra Lesmana, S.Pd", photo: gmpsmp2 },
      { role: "Guru Mapel B. Inggris", name: "Aulia Rahman Suganda, S.Pd", photo: kepalaSmaImg },
      { role: "Guru Mapel SBK", name: "Erviani Ramdani", photo: gmpsmp3 },
      { role: "Guru Mapel IPS", name: "Fudza Maula Hudjadillah, S.Sos", photo: gmpsmp4 },
      { role: "Guru Mapel B. Indonesia", name: "Hari Saputra, S.Pd", photo: gmpsmp5 },
      { role: "Guru Mapel IPA", name: "Reinaldi Aprian, S.Pd", photo: gmpsmp6 },
      { role: "Guru Mapel PPKn", name: "Bhayu Priyagung Januar, S.Pd", photo: gmpsmp7 },
      { role: "Guru Mapel PAI", name: "Ujang Abdurahman, S.Pd", photo: gmpsmp8 },
      { role: "Guru Mapel B. Sunda", name: "Maryana", photo: gmpsmp9 },
      { role: "Guru Mapel Matematika", name: "Nurul Zaman, S.Pd", photo: gmpsmp10 },
       { role: "Informatika", name: "Fanji, S.Pd", photo: gmpsmp11 },

    ],
    description:
      "SMP Arrasyd merupakan sekolah menengah pertama berbasis Islam terpadu.",
    curriculum: [
      "Pembiasaan Sholat dhuha",
      "Pemisaan sholat  dzuhur berjmaah",
      "kelas tahfidz",
      "English Club",
      "arabic Club",
      "Pencak silat",
      "Informatika",
    ],
    facilities: [
      "Ruang kelas multimedia",
      "Laboratorium IPA",
      "Perpustakaan",
      "Musholla",
      "Lapangan olahraga",
    ],
    schedule: "Senin - Sabtu, 07.00 - 13.00 WIB",
    fees: { registration: 50000, monthly: 200000, annual: 500000 },
  },

  sma: {
    name: "SMA Baet El Anshar",
    fullName: "Sekolah Menengah Atas Arrasyd",
    level: "Tingkat Menengah Atas",
    vision:
      "Mencetak lulusan berakhlak, berprestasi, dan siap melanjutkan pendidikan ke jenjang tinggi.",
    mission: [
      "Meningkatkan kualitas akademik siswa",
      "Membentuk karakter Islami dan kepemimpinan",
      "Mempersiapkan siswa menghadapi perguruan tinggi dan dunia kerja",
    ],
    history:
      "SMA Arrasyd didirikan sebagai jenjang lanjutan untuk mencetak generasi unggul.",
    organization: [
      { role: "Ketua Yayasan", name: "KH. Harun Arrasyd", photo: fotoketuayayasan },
      { role: "Kepala Sekolah", name: "Aulia Rahman Suganda, S.Pd", photo: kepalaSmaImg },
      { role: "Guru Mapel PAI", name: "Abdulrahman", photo: gmp1 },
      {role: "Guru Mapel Bahasa Indonesia", name : "Hari Saputra", photo: gmpsmp5},
    ],
    description:
      "SMA Baet El Anshar berfokus pada prestasi akademik, karakter Islami, dan kesiapan masa depan.",
    curriculum: [
      "Matematika",
      "Fisika",
      "Kimia",
      "Biologi",
      "Ekonomi",
      "Geografi",
      "PAI",
      "Tahfidz",
      "Informatika",
    ],
    facilities: [
      "Laboratorium lengkap",
      "Ruang kelas AC",
      "Perpustakaan digital",
      "Aula",
      "Lapangan olahraga",
    ],
    schedule: "Senin - Jumat, 07.00 - 15.00 WIB",
    fees: { registration: 200000, monthly: 150000, annual: 800000 },
  },
};

/* ==================================================
   HELPER
================================================== */
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/* ==================================================
   COMPONENT
================================================== */
export default function InstitutionDetail() {
  const { slug } = useParams();
  const institution = institutionData[slug ?? ""];

  if (!institution) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Lembaga tidak ditemukan</h1>
            <Link to="/">
              <Button>Kembali ke Beranda</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* HERO */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>

          <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
            {institution.level}
          </span>

          <h1 className="text-4xl font-bold text-primary-foreground mb-2">
            {institution.name}
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            {institution.fullName}
          </p>
        </div>
      </section>
      {/* CONTENT */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* MAIN */}
          <div className="lg:col-span-2 space-y-14">
            {/* Tentang */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Tentang Program</h2>
              <p className="text-muted-foreground leading-relaxed">
                {institution.description}
              </p>
            </div>

            {/* Visi Misi */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Visi & Misi</h2>
              <p className="font-semibold mb-2">Visi</p>
              <p className="text-muted-foreground mb-4">
                {institution.vision}
              </p>

              <p className="font-semibold mb-2">Misi</p>
              <ul className="space-y-2">
                {institution.mission.map((m, i) => (
                  <li key={i} className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sejarah */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Sejarah</h2>
              <p className="text-muted-foreground leading-relaxed">
                {institution.history}
              </p>
            </div>

            {/* Struktur Organisasi */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Pendidik dan Tenaga Kependidikan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                {institution.organization.map((o, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-2xl p-4 flex flex-col items-center text-center border shadow-sm"
                  >
                    <img
                      src={o.photo}
                      alt={o.name}
                      className="w-24 h-24 rounded-full object-cover mb-3 border transition-transform duration-300 hover:scale-105"
                    />
                    <p className="font-semibold">{o.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {o.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Kurikulum */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Kurikulum</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {institution.curriculum.map((c) => (
                  <div
                    key={c}
                    className="p-3 bg-accent rounded-xl flex gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-primary mt-1" />
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-2xl border">
              <p className="font-semibold mb-1">Jadwal</p>
              <p className="text-muted-foreground">
                {institution.schedule}
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border">
              <h3 className="font-bold mb-4">Biaya Pendidikan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Pendaftaran</span>
                  <span>
                    {formatCurrency(institution.fees.registration)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>SPP/Bulan</span>
                  <span>
                    {formatCurrency(institution.fees.monthly)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tahunan</span>
                  <span>
                    {formatCurrency(institution.fees.annual)}
                  </span>
                </div>
              </div>
            </div>

            <Link to="/pendaftaran">
              <Button className="w-full">
                <GraduationCap className="w-4 h-4 mr-2" />
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
