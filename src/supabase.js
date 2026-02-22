import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ucguioolhvytinvqnirk.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZ3Vpb29saHZ5dGludnFuaXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NjM0MTksImV4cCI6MjA4NzMzOTQxOX0.Y9ETtIB6QMj5D6Wp278TOLGWKFKf04ecpLHzQ3Wq2cg'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)