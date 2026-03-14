import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { adminEndpoints } from '../../services/adminApi';

export default function AdminMessagesPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminEndpoints.contactMessages.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminPageHeader
        kicker="Engagement"
        title="Contact messages"
        subtitle="Form submissions from the contact page."
      />
      {loading ? <p className="font-mono text-[13px] text-[var(--subtle)]">Loading…</p> : (
        <div className="border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[var(--elevated)] border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Name</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Email</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Subject</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {list.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-[var(--muted)] font-mono text-sm">No messages yet.</td></tr>
              ) : (
                list.map((m) => (
                  <tr key={m.id} className="bg-[var(--elevated)]/50">
                    <td className="px-4 py-3 font-body text-sm text-[var(--white)]">{m.name}</td>
                    <td className="px-4 py-3 font-mono text-[12px] text-[var(--muted)]">{m.email}</td>
                    <td className="px-4 py-3 font-body text-sm text-[var(--muted)]">{m.subject}</td>
                    <td className="px-4 py-3 font-body text-sm text-[var(--muted)] max-w-xs truncate">{m.message}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
