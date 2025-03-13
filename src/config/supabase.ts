import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sxbagocnoxxtkmzwtvys.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4YmFnb2Nub3h4dGttend0dnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2MjczOTUsImV4cCI6MjA1MzIwMzM5NX0.sz32Ka4VZ0XT_8rOVLTLT2pkGr_EGa-kIncdTBu46d0';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);