import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Video, Send, Calendar, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InterviewDialogProps {
  registrationId: string;
  studentName: string;
  currentDate: string | null;
  currentLink: string | null;
  currentNotes: string | null;
  onUpdate: () => void;
}

export default function InterviewDialog({ 
  registrationId, 
  studentName, 
  currentDate,
  currentLink,
  currentNotes,
  onUpdate 
}: InterviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState(
    currentDate ? new Date(currentDate).toISOString().slice(0, 16) : ""
  );
  const [interviewLink, setInterviewLink] = useState(currentLink || "");
  const [interviewNotes, setInterviewNotes] = useState(currentNotes || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!interviewDate || !interviewLink.trim()) {
      toast.error("Tanggal dan link wawancara harus diisi");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("registrations")
        .update({ 
          interview_date: new Date(interviewDate).toISOString(),
          interview_link: interviewLink,
          interview_notes: interviewNotes,
          status: "interview"
        })
        .eq("id", registrationId);

      if (error) throw error;

      toast.success("Undangan wawancara berhasil dikirim");
      setIsOpen(false);
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Gagal mengirim undangan wawancara");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200">
          <Video className="w-4 h-4 mr-2" />
          Wawancara
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif">Kirim Undangan Wawancara Online</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Kirim undangan wawancara online untuk <span className="font-medium text-foreground">{studentName}</span>. 
            Wali santri akan menerima notifikasi dan dapat melihat jadwal wawancara di dashboard mereka.
          </p>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Tanggal & Waktu Wawancara
            </Label>
            <Input
              type="datetime-local"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Link Meeting (Zoom/Google Meet)
            </Label>
            <Input
              placeholder="https://zoom.us/j/xxx atau https://meet.google.com/xxx"
              value={interviewLink}
              onChange={(e) => setInterviewLink(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Catatan Tambahan (Opsional)</Label>
            <Textarea
              placeholder="Contoh: Mohon siapkan dokumen asli untuk verifikasi, pastikan koneksi internet stabil..."
              value={interviewNotes}
              onChange={(e) => setInterviewNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? "Mengirim..." : "Kirim Undangan Wawancara"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}