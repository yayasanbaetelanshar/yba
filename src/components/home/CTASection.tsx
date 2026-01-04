import { Link } from "react-router-dom";
import { GraduationCap, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-emerald-900 relative overflow-hidden">
      {/* Islamic Pattern (opacity rendah agar tidak ganggu teks) */}
      <div className="absolute inset-0 islamic-pattern opacity-10" />
      
      {/* Decorative circles - disesuaikan dengan tema hijau */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Wujudkan Impian Menjadi{" "}
            <span className="text-yellow-400 font-bold">Hafidz Quran</span>
          </h2>
          <p className="text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
            Bergabunglah bersama ribuan santri yang telah menghafal Al-Quran dan meraih 
            prestasi di Yayasan Baet El Anshar.
          </p>
          
          <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
            <Link to="/pendaftaran">
              <Button 
                size="lg" 
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-lg px-10 py-7 rounded-xl shadow-lg transition-all"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Daftar Sekarang
              </Button>
            </Link>

            {/* Tombol Hubungi Kami - teks selalu putih & kontras tinggi */}
            <Link to="/kontak">
              <Button 
                size="lg" 
                className="border-2 border-white/70 text-white hover:bg-white/15 hover:border-white hover:text-white font-semibold text-lg px-10 py-7 rounded-xl backdrop-blur-sm transition-all"
              >
                <Phone className="w-5 h-5 mr-2" />
                Hubungi Kami
              </Button>
            </Link>
          </div>

          {/* Arabic Quote */}
          <div className="mt-16 pt-10 border-t border-white/15">
            <p className="font-serif text-2xl text-white/90 mb-3" dir="rtl">
              خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
            </p>
            <p className="text-white/70 text-sm">
              "Sebaik-baik kalian adalah yang mempelajari Al-Quran dan mengajarkannya" (HR. Bukhari)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}