import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { authApi } from '../../services/adminApi';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setToken, setLoading, isAuthenticated } = useAdminAuth();
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
    setLoading(true);
    try {
      const { access_token } = await authApi.login(email, password);
      setToken(access_token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--void)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-[var(--border)] bg-[var(--surface)]">
        <CardHeader>
          <CardTitle className="font-display text-[22px] text-[var(--white)]">
            Admin
          </CardTitle>
          <p className="text-sm text-[var(--muted)]">Sign in to manage content.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[var(--white)]">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="bg-[var(--elevated)] border-[var(--border-md)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[var(--white)]">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="bg-[var(--elevated)] border-[var(--border-md)]"
              />
            </div>
            {error && (
              <p className="text-sm text-[var(--terracotta)]">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-[var(--sungold)] text-[var(--void)] hover:opacity-90 font-display font-semibold"
            >
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
