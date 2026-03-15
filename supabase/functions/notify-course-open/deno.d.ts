/** Deno and ESM URL types for Supabase Edge Function (IDE only; runs in Deno at deploy). */
declare namespace Deno {
  export const env: { get(key: string): string | undefined };
  export function serve(handler: (req: Request) => Promise<Response>): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export function createClient(url: string, key: string, options?: Record<string, unknown>): any;
}
