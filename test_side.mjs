import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://peincqeqcufbkoccyneo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlaW5jcWVxY3VmYmtvY2N5bmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODg4NDEsImV4cCI6MjA4OTA2NDg0MX0.EnffX_X0YiGz1Y1GbgbanCXAfTC5wXGLpNvj6EFKJDI";
const supabase = createClient(supabaseUrl, supabaseKey);
async function test() {
  const { data } = await supabase.from("projects").select("*").eq("kind", "side");
  console.log(data.map(p => ({ name: p.name, slug: p.slug })));
}
test();
