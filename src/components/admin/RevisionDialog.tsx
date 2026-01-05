import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RevisionDialogProps {
  registrationId: string;
  studentName: string;
  currentNotes: string | null;
  onUpdate: () => void;
}

export default function RevisionDialog({ registrationId, studentName, currentNotes, onUpdate }: RevisionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState(currentNotes || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!revisionNotes.trim()) {
      toast.error("Catatan revisi tidak boleh kosong");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("registrations")
        .update({ 
          revision_notes: revisionNotes,
          status: "document_review"
        })
        .eq("id", registrationId);

      if (error) throw error;

      toast.success("Catatan revisi berhasil dikirim");
      setIsOpen(false);
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Gagal mengirim catatan revisi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Revisi
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif">Berikan Catatan Revisi</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Berikan catatan revisi untuk pendaftaran <span className="font-medium text-foreground">{studentName}</span>. 
            Catatan ini akan ditampilkan kepada wali santri di dashboard mereka.
          </p>
          
          <div className="space-y-2">
            <Label>Catatan Revisi</Label>
            <Textarea
              placeholder="Contoh: Mohon upload ulang foto KTP yang lebih jelas, scan ijazah halaman depan dan belakang..."
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              rows={5}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? "Mengirim..." : "Kirim Catatan Revisi"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}