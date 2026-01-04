import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RegistrationData {
  parentName: string
  parentEmail: string
  parentPhone: string
  parentAddress: string
  studentName: string
  birthPlace: string
  birthDate: string
  gender: string
  previousSchool?: string
  institution: string
  documents?: {
    kk?: string
    ktp?: string
    ijazah?: string
    photo?: string
    buktiTransfer?: string
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const data: RegistrationData = await req.json()
    console.log('Registration data received:', { ...data, parentEmail: '***' })

    // Generate random password
    const generatePassword = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
      let password = ''
      for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return password
    }

    let userId: string
    let password: string | null = null
    let isNewUser = false

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === data.parentEmail)

    if (existingUser) {
      // User already exists, use existing account
      userId = existingUser.id
      console.log('Using existing user:', userId)
    } else {
      // Create new user account
      password = generatePassword()
      isNewUser = true

      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.parentEmail,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: data.parentName
        }
      })

      if (authError) {
        console.error('Auth error:', authError)
        throw new Error(authError.message)
      }

      userId = authData.user.id
      console.log('New user created:', userId)
    }

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: data.parentName,
        phone: data.parentPhone,
        address: data.parentAddress,
      })
      .eq('id', userId)

    if (profileError) {
      console.error('Profile error:', profileError)
    }

    // Get institution id
    const { data: institutionData, error: instError } = await supabase
      .from('institutions')
      .select('id')
      .eq('type', data.institution)
      .single()

    if (instError) {
      console.error('Institution error:', instError)
    }

    // Create student
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        parent_id: userId,
        institution_id: institutionData?.id || null,
        full_name: data.studentName,
        birth_place: data.birthPlace,
        birth_date: data.birthDate,
        gender: data.gender,
        previous_school: data.previousSchool || null,
      })
      .select()
      .single()

    if (studentError) {
      console.error('Student error:', studentError)
      throw new Error(studentError.message)
    }

    console.log('Student created:', student.id)

    // Create registration with documents
    const { error: regError } = await supabase
      .from('registrations')
      .insert({
        student_id: student.id,
        institution_id: institutionData?.id || null,
        status: 'pending',
        documents: data.documents || null,
      })

    if (regError) {
      console.error('Registration error:', regError)
      throw new Error(regError.message)
    }

    console.log('Registration completed successfully')

    return new Response(
      JSON.stringify({
        success: true,
        message: isNewUser 
          ? 'Pendaftaran berhasil! Akun baru telah dibuat.' 
          : 'Pendaftaran berhasil! Santri ditambahkan ke akun yang sudah ada.',
        isNewUser,
        credentials: isNewUser ? {
          email: data.parentEmail,
          password: password
        } : null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: unknown) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan'
    return new Response(
      JSON.stringify({
        success: false,
        message: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
