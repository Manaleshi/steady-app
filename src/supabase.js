import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bpybtoyosazutluijulq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJweWJ0b3lvc2F6dXRsdWlqdWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMjY4NDQsImV4cCI6MjA5ODYwMjg0NH0.YJTElvxJq5FhTs3YdKQtQZfaAdsir9Eo9Ak2UGzs2gI'

export const supabase = createClient(supabaseUrl, supabaseKey)