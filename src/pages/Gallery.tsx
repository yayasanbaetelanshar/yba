import { useState, useEffect } from "react";
import { Image as ImageIcon, Play, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  media_type: string;
  media_url: string;
}

const placeholderGallery = [
  {
    id: "1",
    title: "Wisuda Tahfidz 2024",
    description: "Kelulusan 50 hafidz/hafidzah baru",
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    title: "Kegiatan Mengaji",
    description: "Santri belajar Al-Quran bersama ustadz",
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1584286595398-a59511e0649f?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    title: "Masjid Yayasan",
    description: "Masjid sebagai pusat kegiatan ibadah",
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1564769625392-651b89c75a77?w=600&h=400&fit=crop",
  },
  {
    id: "4",
    title: "Perlombaan Tahfidz",
    description: "Kompetisi hafalan Al-Quran tingkat nasional",
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop",
  },
  {
    id: "5",
    title: "Kegiatan Olahraga",
    description: "Santri berolahraga bersama",
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1461896836934- voices?w=600&h=400&fit=crop",
  },
  {
    id: "6",
    title: "Upacara Bendera",
    description: "Upacara rutin setiap Senin",
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
  },
];

export default function Gallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>(placeholderGallery);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data && data.length > 0) {
      setGallery(data);
    }
  };

  const filteredGallery = gallery.filter((item) => {
    if (filter === "all") return true;
    return item.media_type === filter;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Galeri Kegiatan
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Dokumentasi kegiatan santri, acara yayasan, dan fasilitas pondok pesantren
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {/* Filter */}
          <div className="flex justify-center gap-4 mb-12">
            {["all", "image", "video"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as typeof filter)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {f === "all" ? "Semua" : f === "image" ? "Foto" : "Video"}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer card-hover"
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.media_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-serif text-xl font-bold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/80 text-sm">{item.description}</p>
                  </div>
                </div>
                {item.media_type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredGallery.length === 0 && (
            <div className="text-center py-16">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Belum ada galeri</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <button
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            onClick={() => setSelectedItem(null)}
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {selectedItem.media_type === "video" ? (
              <video
                src={selectedItem.media_url}
                controls
                className="w-full rounded-xl"
              />
            ) : (
              <img
                src={selectedItem.media_url}
                alt={selectedItem.title}
                className="w-full rounded-xl"
              />
            )}
            <div className="mt-4 text-center">
              <h3 className="font-serif text-2xl font-bold text-white mb-2">
                {selectedItem.title}
              </h3>
              <p className="text-white/70">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
