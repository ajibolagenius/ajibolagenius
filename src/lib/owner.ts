// Single source of truth for the site owner's identity across the app layer
// (route middleware + server-action authorization). The database RLS policies
// enforce the same canonical email; keep this value in sync with them.
//
// Override per-environment with OWNER_EMAIL if the owner's login ever changes,
// so the identity lives in one place rather than being hardcoded per file.
export const OWNER_EMAIL =
    process.env.OWNER_EMAIL ?? "ajibolaakelebe@gmail.com";
