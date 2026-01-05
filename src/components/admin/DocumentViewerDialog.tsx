import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Download, ExternalLink, FileText, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Document {
  name: string;
  path: string;
  type: string;
}

interface DocumentViewerDialogProps {
  documents: Document[];
  studentName: string;
}

export default function DocumentViewerDialog({ documents, studentName }: DocumentViewerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string | null>(null);

  const getSignedUrl = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("registration-documents")
        .createSignedUrl(path, 3600); // 1 hour expiry

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error("Error getting signed URL:", error);
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
    if (url) {
      window.open(url, "_blank");
    }
  };

  const getDocumentIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <Image className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const documentLabels: Record<string, string> = {
    kk: "Kartu Keluarga",
    ktp: "KTP Orang Tua",
    ijazah: "Ijazah/SKL",
    foto: "Pas Foto 3x4",
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
          <DialogTitle className="font-serif">Dokumen Pendaftaran - {studentName}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {!documents || documents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Tidak ada dokumen yang diupload
            </p>
          ) : (
            <div className="space-y-6">
              {/* Document List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getDocumentIcon(doc.type)}
                      <div>
                        <p className="font-medium text-foreground">
                          {documentLabels[doc.name] || doc.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(doc)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preview Area */}
              {previewUrl && (
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Preview Dokumen</h4>
                    <Button variant="outline" size="sm" onClick={() => setPreviewUrl(null)}>
                      Tutup Preview
                    </Button>
                  </div>
                  {previewType?.startsWith("image/") ? (
                    <img
                      src={previewUrl}
                      alt="Document preview"
                      className="max-w-full h-auto rounded-lg mx-auto"
                    />
                  ) : previewType === "application/pdf" ? (
                    <iframe
                      src={previewUrl}
                      className="w-full h-[500px] rounded-lg"
                      title="PDF Preview"
                    />
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Preview tidak tersedia untuk tipe file ini
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => window.open(previewUrl, "_blank")}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download File
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}