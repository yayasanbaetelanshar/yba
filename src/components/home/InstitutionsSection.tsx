import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, GraduationCap, School, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";

const institutions = [
  {
    id: "dta",
    name: "DTA Arrasyd",
    description: "Pendidikan agama Islam tingkat dasar dengan fokus pada pembentukan karakter Islami dan Al-Quran.",
    icon: BookOpen,
    level: "Tingkat Dasar",
    color: "bg-emerald-100 text-emerald-700",
    iconBg: "bg-emerald-500",
  },
  {
    id: "smp",
    name: "SMP Baet El Anshar",
    description: "Menggabungkan kurikulum nasional dengan kurikulum pesantren untuk pendidikan menengah pertama.",
    icon: School,
    level: "Tingkat Menengah Pertama",
    color: "bg-gold-100 text-gold-600",
    iconBg: "bg-gold-500",
  },
  {
    id: "sma",
    name: "SMA Baet El Anshar",
    description: "Mempersiapkan santri untuk perguruan tinggi dengan bekal ilmu agama dan hafalan Al-Quran.",
    icon: GraduationCap,
    level: "Tingkat Menengah Atas",
    color: "bg-emerald-100 text-emerald-700",
    iconBg: "bg-emerald-600",
  },
  {
    id: "pesantren",
    name: "Pesantren Tahfidz Quran",
    description: "Program intensif penghafalan Al-Quran 30 juz dengan metode talaqqi dan bimbingan personal.",
    icon: BookMarked,
    level: "Program Tahfidz",
    color: "bg-gold-100 text-gold-600",
    iconBg: "bg-gold-500",
  },
];

export default function InstitutionsSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
            Lembaga Pendidikan
          </span>
          <h2 className="section-heading">
            Empat Pilar Pendidikan <span className="text-primary">Baet El Anshar</span>
          </h2>
          <p className="section-subheading mt-4">
            Pilih jenjang pendidikan yang sesuai untuk putra-putri Anda, dari tingkat dasar 
            hingga program tahfidz intensif.
          </p>
        </div>

        {/* Institution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {institutions.map((inst, index) => (
            <Link
              key={inst.id}
              to={`/lembaga/${inst.id}`}
              className="group"
            >
              <div
                className="bg-card rounded-2xl p-8 shadow-card card-hover border border-border h-full"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 rounded-2xl ${inst.iconBg} flex items-center justify-center shrink-0`}>
                    <inst.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${inst.color} mb-3`}>
                      {inst.level}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {inst.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {inst.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                      Selengkapnya
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/pendaftaran">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
              <GraduationCap className="w-5 h-5 mr-2" />
              Daftarkan Putra-Putri Anda
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
