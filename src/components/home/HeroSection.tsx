import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Overlay gradasi */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80" />
      </div>

      {/* Content - dengan padding vertikal yang lebih fleksibel */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32">
          {/* Bismillah */}
          <p className="text-yellow-400 text-xl sm:text-2xl md:text-3xl font-serif mb-6 md:mb-8 tracking-wide text-center">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>

          {/* Judul Utama */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight text-center mb-6 md:mb-8">
            Yayasan
            <span className="block text-yellow-400 mt-2 md:mt-4">Baet El Anshar</span>
          </h1>

          {/* Deskripsi */}
          <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-10 md:mb-12 lg:mb-14 leading-relaxed text-center">
            Membangun generasi Qur'ani yang berilmu, berakhlak mulia, dan bermanfaat  
            bagi umat melalui pendidikan Islam yang berkualitas.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto mb-12 md:mb-16 lg:mb-20">
            {[
              { number: "4", label: "Lembaga Pendidikan, dan 2 Lembaga Pemberdayaan" },
              { number: "500+", label: "Santri & Siswa" },
              { number: "50+", label: "Tenaga Pengajar" },
              { number: "7+", label: "Tahun Berdiri" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-5 sm:p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/15"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 font-serif mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-white/85">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Button
              size="lg"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-6 text-base sm:text-lg font-medium min-w-[220px] shadow-md hover:shadow-lg transition-all"
              asChild
            >
              <Link to="/tentang">
                Jelajahi Lembaga Kami
              </Link>
            </Button>

            <Button
              size="lg"
              className="border-2 border-white/80 text-white hover:bg-white/15 hover:border-white hover:text-white px-8 py-6 text-base sm:text-lg font-medium min-w-[220px] backdrop-blur-sm transition-all"
              asChild
            >
              <Link to="/kontak">
                Hubungi Kami
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/40 rounded-full flex items-start justify-center p-2 backdrop-blur-sm">
          <div className="w-1.5 h-3 bg-yellow-400 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;