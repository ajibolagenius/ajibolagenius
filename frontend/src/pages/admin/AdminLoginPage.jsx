import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

  if (isAuthenticated) return null;

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
    <div className="min-h-screen bg-[var(--void)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Nebula glow backdrop */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-[var(--nebula)] opacity-[0.04] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[55%] bg-[var(--sungold)] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sharp-lg)] relative">
          {/* Corner accents */}
          <div className="absolute -top-px -left-px w-4 h-4 border-t border-l border-[var(--sungold)] opacity-40" />
          <div className="absolute -bottom-px -right-px w-4 h-4 border-b border-r border-[var(--sungold)] opacity-40" />

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
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-body text-[13px] text-[var(--terracotta)]"
                >
                  {error}
                </motion.p>
              )}
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 font-display font-semibold text-[13px] tracking-[0.04em] bg-[var(--sungold)] text-[var(--void)] rounded-none hover:opacity-95 hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  {submitting ? 'Signing in…' : 'Sign in'}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

