import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../stores/authStore';
import { Link, useNavigate } from 'react-router-dom';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória')
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid }, reset } = useForm<FormData>({ 
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = async (data: FormData) => {
    try {
      clearError?.();
      await login(data.email, data.password);
      reset();
      navigate('/home', { replace: true });
    } catch {
      /* error handled via store */
    }
  };

  if (isAuthenticated) return (<div className="center">Redirecionando...</div>);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <img src="/logo.webp" alt="Central de Outdoor" style={{ width: 200, height: 80, objectFit: 'contain' }} />
        </div>

        <div className="card" style={{ width: '100%' }}>
          <h1 style={{ margin: 0, marginBottom: 8, textAlign: 'center', color: 'var(--cdo-primary)' }}>Entrar</h1>
          <p style={{ marginTop: 0, textAlign: 'center', opacity: .8 }}>Acesse sua conta</p>

          <form onSubmit={handleSubmit(onSubmit)} className="stack">
            <div>
              <label>Email</label>
              <input type="email" {...register('email')} aria-invalid={!!errors.email} />
              {errors.email && <small style={{ color: '#e74c3c' }}>{errors.email.message}</small>}
            </div>
            <div>
              <label>Senha</label>
              <input type="password" {...register('password')} aria-invalid={!!errors.password} />
              {errors.password && <small style={{ color: '#e74c3c' }}>{errors.password.message}</small>}
            </div>

            {error && <div style={{ color: '#e74c3c', fontSize: 12, textAlign: 'center' }}>{error}</div>}

            <button className="btn" disabled={!isValid || isSubmitting || isLoading} type="submit">
              {(isSubmitting || isLoading) ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <span>Não tem conta? </span>
            <Link to="/register">Criar conta</Link>
          </div>
        </div>
      </div>
    </div>
  );
}


