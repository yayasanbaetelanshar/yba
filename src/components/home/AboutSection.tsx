import { BookOpen, Users, Award, Heart } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Kurikulum Terpadu",
    description: "Memadukan kurikulum nasional dengan kurikulum pesantren untuk pendidikan yang komprehensif.",
  },
  {
    icon: Users,
    title: "Pengajar Berkualitas",
    description: "Ustadz dan guru yang berpengalaman dengan kualifikasi akademik dan keislaman yang mumpuni.",
  },
  {
    icon: Award,
    title: "Prestasi Gemilang",
    description: "Menghasilkan lulusan berprestasi di bidang akademik, tahfidz, dan kompetisi nasional.",
  },
  {
    icon: Heart,
    title: "Pembentukan Akhlak",
    description: "Fokus pada pembentukan karakter Islami dan akhlakul karimah dalam kehidupan sehari-hari.",
  },
];

export default function AboutSection() {
  return (
    <section className="py-20 lg:py-28 bg-background islamic-pattern">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
            Tentang Kami
          </span>
          <h2 className="section-heading">
            Membangun Generasi{" "}
            <span className="text-primary">Qurani</span> yang Berkualitas
          </h2>
          <p className="section-subheading mt-4">
            Yayasan Baet El Anshar berkomitmen untuk memberikan pendidikan Islam terbaik 
            yang mengintegrasikan ilmu agama dan ilmu umum dalam satu kesatuan.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-8 shadow-card card-hover border border-border"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Vision & Mission */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-primary rounded-2xl p-10 text-primary-foreground">
            <h3 className="font-serif text-2xl font-bold mb-4">Visi</h3>
            <p className="text-primary-foreground/90 leading-relaxed text-lg">
              Menjadi lembaga pendidikan Islam terdepan yang melahirkan generasi 
              hafidz Quran, berakhlak mulia, dan berwawasan global.
            </p>
          </div>
          <div className="bg-secondary rounded-2xl p-10 text-secondary-foreground">
            <h3 className="font-serif text-2xl font-bold mb-4">Misi</h3>
            <ul className="space-y-3 text-secondary-foreground/90">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-secondary-foreground mt-2" />
                Menyelenggarakan pendidikan Islam yang berkualitas dan terintegrasi
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-secondary-foreground mt-2" />
                Membina santri menjadi hafidz Quran dengan pemahaman yang baik
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-secondary-foreground mt-2" />
                Mengembangkan potensi akademik dan non-akademik santri
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
