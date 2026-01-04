import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";

const contactSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Email tidak valid").max(255, "Email maksimal 255 karakter"),
  phone: z.string().min(10, "Nomor telepon tidak valid").max(20, "Nomor telepon maksimal 20 karakter"),
  subject: z.string().min(5, "Subjek minimal 5 karakter").max(200, "Subjek maksimal 200 karakter"),
  message: z.string().min(10, "Pesan minimal 10 karakter").max(1000, "Pesan maksimal 1000 karakter"),
});

type ContactForm = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: MapPin,
    title: "Alamat",
    details: ["Kp. Pasir Awi RT 11/003 Desa Palasarigirang Kecamatan Kalapanunggal Kabupaten Sukabumi, Jawa Barat 43353"],
  },
  {
    icon: Phone,
    title: "Telepon",
    details: ["+62 857-2300-6453"],
  },
  {
    icon: Mail,
    title: "Email",
    details: ["yayasanbaetelanshar2@gmail.com"],
  },
  {
    icon: Clock,
    title: "Jam Operasional",
    details: ["Senin - Jumat: 08.00 - 16.00", "Sabtu: 08.00 - 12.00"],
  },
];

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const handleSubmit = async (data: ContactForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      });

      if (error) throw error;

      setIsSuccess(true);
      form.reset();
      toast.success("Pesan berhasil dikirim!");
    } catch (error) {
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Hubungi Kami
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Kami siap menjawab pertanyaan Anda tentang yayasan dan program pendidikan kami
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
                Informasi Kontak
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-muted-foreground text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="mt-10 aspect-video rounded-2xl overflow-hidden bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d188.60498212957222!2d106.65631173461091!3d-6.809713511190727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sid!2sid!4v1767561484602!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Lokasi Yayasan"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-card rounded-2xl shadow-card p-8 border border-border">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Kirim Pesan
                </h2>

                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Pesan Terkirim!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Terima kasih telah menghubungi kami. Kami akan segera merespons pesan Anda.
                    </p>
                    <Button onClick={() => setIsSuccess(false)}>
                      Kirim Pesan Lagi
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                          id="name"
                          placeholder="Masukkan nama Anda"
                          {...form.register("name")}
                        />
                        {form.formState.errors.name && (
                          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          {...form.register("email")}
                        />
                        {form.formState.errors.email && (
                          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input
                          id="phone"
                          placeholder="08xxxxxxxxxx"
                          {...form.register("phone")}
                        />
                        {form.formState.errors.phone && (
                          <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subjek</Label>
                        <Input
                          id="subject"
                          placeholder="Subjek pesan"
                          {...form.register("subject")}
                        />
                        {form.formState.errors.subject && (
                          <p className="text-sm text-destructive">{form.formState.errors.subject.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Pesan</Label>
                      <Textarea
                        id="message"
                        placeholder="Tulis pesan Anda di sini..."
                        className="min-h-[150px]"
                        {...form.register("message")}
                      />
                      {form.formState.errors.message && (
                        <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        "Mengirim..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Kirim Pesan
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
