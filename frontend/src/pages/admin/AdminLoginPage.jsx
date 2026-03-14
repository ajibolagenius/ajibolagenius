import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message || 'Invalid email or password');
        return;
      }
      navigate(from, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--void)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sharp-lg)]">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-px bg-[var(--sungold)]" aria-hidden />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
              Sign in
            </span>
          </div>
          <CardTitle
            className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] text-[var(--white)]"
            style={{ fontSize: 'clamp(22px, 3vw, 28px)' }}
          >
            Admin
          </CardTitle>
          <p className="font-body text-[15px] text-[var(--muted)] mt-1 max-w-[360px]">
            Manage portfolio content. Design & Engineering — no boundaries.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-mono text-[11px] tracking-[0.08em] text-[var(--white)]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="bg-[var(--elevated)] border-[var(--border-md)] rounded-none focus-visible:ring-[3px] focus-visible:ring-[rgba(232,160,32,0.2)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-mono text-[11px] tracking-[0.08em] text-[var(--white)]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="bg-[var(--elevated)] border-[var(--border-md)] rounded-none focus-visible:ring-[3px] focus-visible:ring-[rgba(232,160,32,0.2)]"
              />
            </div>
            {error && (
              <p className="font-body text-[13px] text-[var(--terracotta)]">{error}</p>
            )}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 font-display font-semibold text-[13px] tracking-[0.04em] bg-[var(--sungold)] text-[var(--void)] rounded-none hover:opacity-95 hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5 transition-all duration-200"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
