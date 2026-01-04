-- Create enum for institution types
CREATE TYPE public.institution_type AS ENUM ('dta', 'smp', 'sma', 'pesantren');

-- Create enum for registration status
CREATE TYPE public.registration_status AS ENUM ('pending', 'document_review', 'interview', 'accepted', 'rejected');

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'parent', 'teacher');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create institutions table
CREATE TABLE public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type institution_type NOT NULL,
  description TEXT,
  curriculum TEXT,
  facilities TEXT[],
  registration_fee NUMERIC,
  monthly_fee NUMERIC,
  annual_fee NUMERIC,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  birth_date DATE,
  birth_place TEXT,
  gender TEXT,
  previous_school TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create registrations table
CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE NOT NULL,
  status registration_status DEFAULT 'pending',
  documents JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create academic_records table (nilai akademik)
CREATE TABLE public.academic_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  semester INTEGER NOT NULL,
  academic_year TEXT NOT NULL,
  score NUMERIC,
  grade TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create hafalan_progress table (progress hafalan)
CREATE TABLE public.hafalan_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  surah_name TEXT NOT NULL,
  juz INTEGER,
  status TEXT DEFAULT 'in_progress',
  memorized_date DATE,
  teacher_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create gallery table
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT DEFAULT 'image',
  media_url TEXT NOT NULL,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hafalan_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for institutions (public read)
CREATE POLICY "Anyone can view institutions" ON public.institutions FOR SELECT USING (true);
CREATE POLICY "Admins can manage institutions" ON public.institutions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for students
CREATE POLICY "Parents can view own students" ON public.students FOR SELECT USING (auth.uid() = parent_id);
CREATE POLICY "Parents can insert own students" ON public.students FOR INSERT WITH CHECK (auth.uid() = parent_id);
CREATE POLICY "Parents can update own students" ON public.students FOR UPDATE USING (auth.uid() = parent_id);
CREATE POLICY "Admins can view all students" ON public.students FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for registrations
CREATE POLICY "Parents can view own registrations" ON public.registrations FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.students WHERE students.id = registrations.student_id AND students.parent_id = auth.uid()));
CREATE POLICY "Parents can insert registrations" ON public.registrations FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.students WHERE students.id = registrations.student_id AND students.parent_id = auth.uid()));
CREATE POLICY "Admins can manage registrations" ON public.registrations FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for academic_records
CREATE POLICY "Parents can view own student records" ON public.academic_records FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.students WHERE students.id = academic_records.student_id AND students.parent_id = auth.uid()));
CREATE POLICY "Teachers and admins can manage records" ON public.academic_records FOR ALL 
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));

-- RLS Policies for hafalan_progress
CREATE POLICY "Parents can view own student hafalan" ON public.hafalan_progress FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.students WHERE students.id = hafalan_progress.student_id AND students.parent_id = auth.uid()));
CREATE POLICY "Teachers and admins can manage hafalan" ON public.hafalan_progress FOR ALL 
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));

-- RLS Policies for gallery (public read)
CREATE POLICY "Anyone can view gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery" ON public.gallery FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for contact_messages
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view messages" ON public.contact_messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'User'));
  
  -- Default role is parent
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'parent');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON public.registrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hafalan_progress_updated_at BEFORE UPDATE ON public.hafalan_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial institution data
INSERT INTO public.institutions (name, type, description, curriculum, facilities, registration_fee, monthly_fee, annual_fee) VALUES
('DTA Arrasyd', 'dta', 'Diniyah Takmiliyah Awaliyah Arrasyd merupakan lembaga pendidikan agama Islam tingkat dasar yang fokus pada pembentukan karakter Islami dan penguasaan dasar-dasar agama Islam.', 'Kurikulum berbasis Al-Quran, Hadits, Fiqih, Akhlak, dan Bahasa Arab dasar', ARRAY['Ruang kelas ber-AC', 'Musholla', 'Perpustakaan', 'Area bermain'], 500000, 150000, 1500000),
('SMP Baet El Anshar', 'smp', 'SMP Baet El Anshar menggabungkan kurikulum nasional dengan kurikulum pesantren untuk menciptakan generasi yang unggul dalam ilmu umum dan agama.', 'Kurikulum Nasional K-13 + Kurikulum Pesantren (Tahfidz, Kitab Kuning, Bahasa Arab)', ARRAY['Laboratorium IPA', 'Laboratorium Komputer', 'Perpustakaan', 'Masjid', 'Asrama', 'Lapangan Olahraga'], 2500000, 750000, 7500000),
('SMA Baet El Anshar', 'sma', 'SMA Baet El Anshar mempersiapkan santri untuk melanjutkan ke perguruan tinggi terbaik dengan bekal ilmu agama yang kuat dan hafalan Al-Quran.', 'Kurikulum Nasional K-13 + Program Tahfidz 30 Juz + Bahasa Arab & Inggris Intensif', ARRAY['Laboratorium IPA Lengkap', 'Laboratorium Bahasa', 'Laboratorium Komputer', 'Perpustakaan Digital', 'Masjid', 'Asrama Putra-Putri', 'Lapangan Olahraga', 'Aula'], 3000000, 1000000, 10000000),
('Pondok Pesantren Tahfidz Quran Baet El Anshar', 'pesantren', 'Pondok Pesantren Tahfidz Quran Baet El Anshar adalah lembaga pendidikan yang fokus pada penghafalan dan pemahaman Al-Quran dengan metode talaqqi dan setoran harian.', 'Program Tahfidz 30 Juz dalam 3 Tahun + Kajian Tafsir + Ilmu Tajwid + Bahasa Arab', ARRAY['Masjid Besar', 'Asrama Putra', 'Asrama Putri', 'Ruang Tahfidz', 'Perpustakaan Islam', 'Dapur Umum', 'Klinik Kesehatan', 'Lapangan'], 2000000, 1200000, 12000000);