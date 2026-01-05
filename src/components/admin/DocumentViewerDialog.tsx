import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink, FileText, Image, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Document {
  name: string;
  path: string;
  type: string;
}

interface DocumentViewerDialogProps {
  documents: any; // ⬅️ PENTING
  studentName: string;
}

export default function DocumentViewerDialog({
  documents,
  studentName,
}: DocumentViewerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string | null>(null);

  /**
   * 🔑 NORMALISASI DOCUMENTS
   * Support:
   * - []
   * - {}
   * - { kk: "path" }
   * - { kk: { path, type } }
   */
  const normalizedDocuments: Document[] = useMemo(() => {
    if (!documents) return [];

    // Sudah array
    if (Array.isArray(documents)) {
      return documents
        .filter((d) => d && d.path)
        .map((d) => ({
          name: d.name ?? "Dokumen",
          path: d.path,
          type: d.type ?? "application/octet-stream",
        }));
    }

    // JSON object
    if (typeof documents === "object") {
      return Object.entries(documents).map(([key, value]: any) => {
        if (typeof value === "string") {
          return {
            name: key,
            path: value,
            type: value.endsWith(".pdf")
              ? "application/pdf"
              : "image/jpeg",
          };
        }

        if (typeof value === "object" && value?.path) {
          return {
            name: key,
            path: value.path,
            type: value.type ?? "application/octet-stream",
          };
        }

        return null;
      }).filter(Boolean) as Document[];
    }

    return [];
  }, [documents]);

  const getSignedUrl = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("registration-documents")
        .createSignedUrl(path, 3600);

      if (error) throw error;
      return data.signedUrl;
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil dokumen");
      return null;
    }
  };

  const handlePreview = async (doc: Document) => {
    const url = await getSignedUrl(doc.path);
    if (url) {
      setPreviewUrl(url);
      setPreviewType(doc.type);
    }
  };

  const handleDownload = async (doc: Document) => {
    const url = await getSignedUrl(doc.path);
    if (url) window.open(url, "_blank");
  };

  const getIcon = (type: string) =>
    type.startsWith("image/")
      ? <Image className="w-4 h-4" />
      : <FileText className="w-4 h-4" />;

  const documentLabels: Record<string, string> = {
    kk: "Kartu Keluarga",
    ktp: "KTP Orang Tua",
    ijazah: "Ijazah / SKL",
    foto: "Pas Foto",
    bukti_transfer: "Bukti Transfer",
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Lihat Dokumen
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Dokumen Pendaftaran – {studentName}
          </DialogTitle>
        </DialogHeader>

        {normalizedDocuments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Tidak ada dokumen yang diupload
          </p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {normalizedDocuments.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getIcon(doc.type)}
                    <div>
                      <p className="font-medium">
                        {documentLabels[doc.name] ?? doc.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {doc.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreview(doc)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(doc)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {previewUrl && (
              <div className="border rounded-lg p-4">
                {previewType?.startsWith("image/") ? (
                  <img src={previewUrl} className="mx-auto rounded" />
                ) : previewType === "application/pdf" ? (
                  <iframe
                    src={previewUrl}
                    className="w-full h-[500px]"
                  />
                ) : (
                  <Button onClick={() => window.open(previewUrl, "_blank")}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
