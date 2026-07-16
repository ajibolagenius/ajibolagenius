import { createClient } from "@/lib/supabase/server";
import { markMessageRead, deleteMessage } from "./actions";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="mb-8 text-2xl font-semibold">Messages</h1>

      {error && <p className="text-sm text-red-600">{error.message}</p>}

      {!error && (messages as ContactMessage[] | null)?.length === 0 && (
        <p className="text-sm text-ink/60">No messages yet.</p>
      )}

      <ul className="flex flex-col gap-3">
        {(messages as ContactMessage[] | null)?.map((msg) => (
          <li
            key={msg.id}
            className={`rounded-md border p-4 ${
              msg.read ? "border-ink/10" : "border-accent/60 bg-panel"
            }`}
          >
            <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <p className="font-medium">
                  {msg.name}
                  {!msg.read && (
                    <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                      New
                    </span>
                  )}
                </p>
                <a
                  href={`mailto:${msg.email}`}
                  className="break-all text-sm text-ink/60 underline"
                >
                  {msg.email}
                </a>
              </div>
              <p className="whitespace-nowrap text-xs text-ink/40">
                {new Date(msg.created_at).toLocaleString()}
              </p>
            </div>
            <p className="whitespace-pre-wrap text-sm text-ink/80">
              {msg.message}
            </p>
            <div className="mt-3 flex gap-3">
              <form
                action={async () => {
                  "use server";
                  await markMessageRead(msg.id, !msg.read);
                }}
              >
                <button
                  type="submit"
                  className="text-sm text-ink/60 underline"
                >
                  Mark as {msg.read ? "unread" : "read"}
                </button>
              </form>
              <form
                action={async () => {
                  "use server";
                  await deleteMessage(msg.id);
                }}
              >
                <button type="submit" className="text-sm text-red-600 underline">
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
