import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Users, Clock, DollarSign, CheckCircle, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const institutionData = {
  dta: {
    name: "DTA Arrasyd",
    fullName: "Diniyah Takmiliyah Awaliyah Arrasyd",
    level: "Tingkat Dasar",
    description: "Diniyah Takmiliyah Awaliyah Arrasyd merupakan lembaga pendidikan agama Islam tingkat dasar yang fokus pada pembentukan karakter Islami dan penguasaan dasar-dasar agama Islam. Program ini dirancang untuk anak-anak usia 6-12 tahun.",
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
      "Ruang kelas ber-AC",
      "Musholla",
      "Perpustakaan Islam",
      "Area bermain",
      "Kantin sehat",
    ],
    schedule: "Senin - Jumat, 14.00 - 17.00 WIB",
    fees: {
      registration: 500000,
      monthly: 150000,
      annual: 1500000,
    },
  },
  smp: {
    name: "SMP Baet El Anshar",
    fullName: "Sekolah Menengah Pertama Baet El Anshar",
    level: "Tingkat Menengah Pertama",
    description: "SMP Baet El Anshar menggabungkan kurikulum nasional dengan kurikulum pesantren untuk menciptakan generasi yang unggul dalam ilmu umum dan agama. Santri dididik untuk menjadi pribadi yang berakhlak mulia dan berprestasi.",
    curriculum: [
      "Kurikulum Nasional K-13",
      "Program Tahfidz Al-Quran (Target 5 Juz)",
      "Kajian Kitab Kuning",
      "Bahasa Arab Intensif",
      "Bahasa Inggris",
      "Matematika & Sains",
      "Ilmu Pengetahuan Sosial",
    ],
    facilities: [
      "Laboratorium IPA",
      "Laboratorium Komputer",
      "Perpustakaan",
      "Masjid",
      "Asrama Putra & Putri",
      "Lapangan Olahraga",
      "Kantin",
    ],
    schedule: "Program Boarding (24 Jam)",
    fees: {
      registration: 2500000,
      monthly: 750000,
      annual: 7500000,
    },
  },
  sma: {
    name: "SMA Baet El Anshar",
    fullName: "Sekolah Menengah Atas Baet El Anshar",
    level: "Tingkat Menengah Atas",
    description: "SMA Baet El Anshar mempersiapkan santri untuk melanjutkan ke perguruan tinggi terbaik dengan bekal ilmu agama yang kuat dan hafalan Al-Quran. Program akademik yang komprehensif dipadukan dengan pembinaan spiritual intensif.",
    curriculum: [
      "Kurikulum Nasional K-13 (IPA/IPS)",
      "Program Tahfidz 30 Juz",
      "Bahasa Arab & Inggris Intensif",
      "Persiapan UTBK/SBMPTN",
      "Kajian Tafsir Al-Quran",
      "Fiqih Muamalah",
      "Leadership & Public Speaking",
    ],
    facilities: [
      "Laboratorium IPA Lengkap",
      "Laboratorium Bahasa",
      "Laboratorium Komputer",
      "Perpustakaan Digital",
      "Masjid",
      "Asrama Putra & Putri",
      "Lapangan Olahraga",
      "Aula Serbaguna",
    ],
    schedule: "Program Boarding (24 Jam)",
    fees: {
      registration: 3000000,
      monthly: 1000000,
      annual: 10000000,
    },
  },
  pesantren: {
    name: "Pesantren Tahfidz Quran",
    fullName: "Pondok Pesantren Tahfidz Quran Baet El Anshar",
    level: "Program Tahfidz",
    description: "Pondok Pesantren Tahfidz Quran Baet El Anshar adalah lembaga pendidikan yang fokus pada penghafalan dan pemahaman Al-Quran dengan metode talaqqi dan setoran harian. Program ini dirancang untuk menghasilkan hafidz/hafidzah yang mutqin.",
    curriculum: [
      "Program Tahfidz 30 Juz dalam 3 Tahun",
      "Kajian Tafsir Al-Quran",
      "Ilmu Tajwid Mendalam",
      "Bahasa Arab Fusha",
      "Hadits dan Ulumul Hadits",
      "Fiqih dan Ushul Fiqih",
      "Akhlak Tasawuf",
    ],
    facilities: [
      "Masjid Besar",
      "Asrama Putra",
      "Asrama Putri",
      "Ruang Tahfidz Khusus",
      "Perpustakaan Islam",
      "Dapur Umum",
      "Klinik Kesehatan",
      "Lapangan Olahraga",
    ],
    schedule: "Program Mukim (24 Jam)",
    fees: {
      registration: 2000000,
      monthly: 1200000,
      annual: 12000000,
    },
  },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function InstitutionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const institution = institutionData[slug as keyof typeof institutionData];

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
      {/* Hero */}
      <section className="bg-primary py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
            {institution.level}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
            {institution.name}
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl">
            {institution.fullName}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                  Tentang Program
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {institution.description}
                </p>
              </div>

              {/* Curriculum */}
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Kurikulum
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {institution.curriculum.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 p-4 bg-accent rounded-xl"
                    >
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" />
                  Fasilitas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {institution.facilities.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 p-4 bg-muted rounded-xl"
                    >
                      <CheckCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Schedule Card */}
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jadwal</p>
                    <p className="font-semibold text-foreground">{institution.schedule}</p>
                  </div>
                </div>
              </div>

              {/* Fees Card */}
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    Biaya Pendidikan
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-muted-foreground">Pendaftaran</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(institution.fees.registration)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-muted-foreground">SPP/Bulan</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(institution.fees.monthly)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tahunan</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(institution.fees.annual)}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
                <h3 className="font-serif text-xl font-bold mb-3">
                  Tertarik Mendaftar?
                </h3>
                <p className="text-primary-foreground/80 text-sm mb-6">
                  Daftarkan putra-putri Anda sekarang dan jadilah bagian dari keluarga besar Baet El Anshar.
                </p>
                <Link to="/pendaftaran">
                  <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Daftar Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
