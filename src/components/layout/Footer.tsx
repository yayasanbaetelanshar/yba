import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";
import LogoYayasan from "@/assets/logo yayasan.png"; // ← Logo yayasan ditambahkan di sini

const quickLinks = [
  { name: "DTA Arrasyd", href: "/lembaga/dta" },
  { name: "SMP Baet El Anshar", href: "/lembaga/smp" },
  { name: "SMA Baet El Anshar", href: "/lembaga/sma" },
  { name: "Pesantren Tahfidz", href: "/lembaga/pesantren" },
];

const infoLinks = [
  { name: "Tentang Yayasan", href: "/tentang" },
  { name: "Pendaftaran", href: "/pendaftaran" },
  { name: "Galeri", href: "/galeri" },
  { name: "Kontak", href: "/kontak" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Islamic pattern overlay */}
      <div className="islamic-pattern">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand - dengan logo yayasan asli */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {/* Logo yayasan */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-full overflow-hidden bg-primary-foreground/10 border border-primary-foreground/20">
                  <img
                    src={LogoYayasan}
                    alt="Logo Yayasan Baet El Anshar"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold">Baet El Anshar</h3>
                  <p className="text-sm text-primary-foreground/80">Yayasan Pendidikan Islam</p>
                </div>
              </div>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                Membentuk generasi Qurani yang berakhlak mulia, berwawasan luas, 
                dan siap menjadi pemimpin umat.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Youtube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-serif text-lg font-bold mb-4">Lembaga Pendidikan</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info Links */}
            <div>
              <h4 className="font-serif text-lg font-bold mb-4">Informasi</h4>
              <ul className="space-y-3">
                {infoLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-serif text-lg font-bold mb-4">Kontak</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                  <span className="text-primary-foreground/80 text-sm">
                    Kp. Pasir Awi RT 11/003 Desa Palasarigirang Kecamatan Kalapanunggal Kabupaten Sukabumi, Jawa Barat 43353<br />
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 shrink-0" />
                  <span className="text-primary-foreground/80 text-sm">+62 857-2300-6453</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 shrink-0" />
                  <span className="text-primary-foreground/80 text-sm">yayasanbaetelanshar2@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-primary-foreground/60 text-sm">
                © {new Date().getFullYear()} Yayasan Baet El Anshar. Hak Cipta Dilindungi.
              </p>
              <p className="text-primary-foreground/60 text-sm">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}