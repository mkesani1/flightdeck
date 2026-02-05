import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rgwuqfhxhwwsezzuygii.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnd3VxZmh4aHd3c2V6enV5Z2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDUxNTIsImV4cCI6MjA4NDU4MTE1Mn0.DYoMVyEj4j3FXojinIWdtwqgQIgpxo6V9oD4k-ucxXA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export for use in hooks
export default supabase;
