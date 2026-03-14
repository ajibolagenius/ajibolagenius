import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { adminEndpoints } from '../../services/adminApi';

export default function AdminNewsletterPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminEndpoints.newsletterSubscribers.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminPageHeader kicker="Engagement" title="Newsletter subscribers" subtitle="Mailing list from the blog signup." />
      {loading ? <p className="text-[var(--muted)] font-mono text-sm">Loading…</p> : (
        <div className="border border-[var(--border)] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[var(--surface)] border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {list.length === 0 ? (
                <tr><td className="px-4 py-8 text-center text-[var(--muted)] font-mono text-sm">No subscribers yet.</td></tr>
              ) : (
                list.map((s) => (
                  <tr key={s.id} className="bg-[var(--elevated)]/50">
                    <td className="px-4 py-3 font-mono text-[12px] text-[var(--white)]">{s.email}</td>
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
