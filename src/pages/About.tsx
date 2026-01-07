import Layout from "@/components/layout/Layout";
import AboutSection from "@/components/home/AboutSection";
import { BookOpen, Users, Award, Heart, Star } from "lucide-react";
import fotoketua from "@/assets/foto abah.png"

const milestones = [
  { year: "2018", event: "Pendirian Yayasan Baet El Anshar" },
  { year: "2019", event: "Pembukaan Pondok Pesantren Baet El Anshar" },
  { year: "2020", event: "Pembukaan DTA Arrasyd" },
  { year: "2021", event: "Pemukaan SMP Baet El Anshar" },
  { year: "2023", event: "Perolehan izin SMP Baet El Anshar dan DTA Arrasyd" },
  { year: "2024", event: "Pembukaan SMA Baet El Anshar" },
];

const achievements = [
  { icon: Star, value: "50+", label: "Juara Kompetisi Nasional" },
  { icon: BookOpen, value: "500+", label: "Hafidz Al-Quran" },
  { icon: Users, value: "1000+", label: "Santri Aktif" },
  { icon: Award, value: "95%", label: "Lulusan Diterima PTN" },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            Tentang Yayasan
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Yayasan Baet El Anshar didirikan dengan visi membentuk generasi Qurani yang 
            berakhlak mulia, berwawasan luas, dan siap menjadi pemimpin umat.
          </p>
        </div>
      </section>

      {/* Sambutan Ketua Yayasan - Posisi paling atas setelah hero */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
              Sambutan
            </span>
            <h2 className="section-heading mb-8">
              Sambutan <span className="text-primary">Ketua Yayasan</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-[1fr,2fr] gap-10 items-center">
              {/* Foto Ketua (placeholder) */}
<div className="flex justify-center">
  <div className="w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden border-4 border-secondary/30 shadow-xl">
    <img 
      src={fotoketua} 
      alt="KH. Harrun Arrasyd" 
      className="w-full h-full object-cover"
    />
  </div>
</div>

              {/* Isi Sambutan */}
              <div className="text-lg leading-relaxed text-foreground/90">
                <p className="mb-6">
                  <strong>Assalamu'alaikum Warahmatullahi Wabarakatuh,</strong>
                </p>
                
                <p className="mb-6">
                  Alhamdulillah, segala puji hanya milik Allah SWT yang telah memberikan 
                  rahmat dan hidayah-Nya sehingga Yayasan Baet El Anshar dapat berdiri 
                  dan terus berkembang hingga hari ini.
                </p>

                <p className="mb-6">
                  Visi kami sederhana namun sangat mulia: mencetak generasi Qur'ani 
                  yang tidak hanya hafal Al-Qur'an, tetapi juga menghayati, mengamalkan, 
                  dan menjadi teladan dalam kehidupan sehari-hari. Kami percaya pendidikan 
                  Islam yang berkualitas adalah kunci untuk membangun peradaban umat yang 
                  mulia dan bermartabat.
                </p>

                <p className="mb-6 font-medium">
                  Mari bersama-sama kita wujudkan generasi yang <em>muta'allim</em>, 
                  <em>muta'addib</em>, dan <em>muntafi'</em> bagi agama, bangsa, dan umat manusia.
                </p>

                <p className="text-right mt-10">
                  Wassalamu'alaikum Warahmatullahi Wabarakatuh,<br />
                  <strong>KH. Harun Arrasyd</strong><br />
                  <span className="text-muted-foreground">Ketua Yayasan Baet El Anshar</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline - Sejarah Pendirian */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
              Perjalanan Kami
            </span>
            <h2 className="section-heading">
              Sejarah <span className="text-primary">Pendirian & Perkembangan</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-0.5" />

              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-center gap-8 mb-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 z-10" />

                  <div className={`ml-12 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                  }`}>
                    <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                      <span className="text-secondary font-bold text-lg">{milestone.year}</span>
                      <p className="text-foreground mt-1">{milestone.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 lg:py-28 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Prestasi Kami
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Alhamdulillah, dengan rahmat Allah SWT, Yayasan Baet El Anshar telah mencapai berbagai prestasi.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {achievements.map((item) => (
              <div
                key={item.label}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 text-center"
              >
                <item.icon className="w-10 h-10 text-secondary mx-auto mb-4" />
                <p className="font-serif text-4xl font-bold text-primary-foreground mb-2">
                  {item.value}
                </p>
                <p className="text-primary-foreground/80 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section (opsional - bisa dihapus jika tidak diperlukan) */}
      <AboutSection />
    </Layout>
  );
}
