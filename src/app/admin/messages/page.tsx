import Link from "next/link";
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
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/admin" className="text-sm text-neutral-500 underline">
        &larr; Admin
      </Link>
      <h1 className="mt-2 mb-8 text-2xl font-semibold">Messages</h1>

      {error && <p className="text-sm text-red-600">{error.message}</p>}

      {!error && (messages as ContactMessage[] | null)?.length === 0 && (
        <p className="text-sm text-neutral-500">No messages yet.</p>
      )}

      <ul className="flex flex-col gap-3">
        {(messages as ContactMessage[] | null)?.map((msg) => (
          <li
            key={msg.id}
            className={`rounded-md border p-4 ${
              msg.read
                ? "border-neutral-200 dark:border-neutral-800"
                : "border-neutral-900 dark:border-neutral-100"
            }`}
          >
            <div className="mb-2 flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{msg.name}</p>
                <a
                  href={`mailto:${msg.email}`}
                  className="text-sm text-neutral-500 underline"
                >
                  {msg.email}
                </a>
              </div>
              <p className="whitespace-nowrap text-xs text-neutral-400">
                {new Date(msg.created_at).toLocaleString()}
              </p>
            </div>
            <p className="whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300">
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
                  className="text-sm text-neutral-500 underline"
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
