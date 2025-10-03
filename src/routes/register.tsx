import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const profileSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  company: z.string().min(1, 'Empresa obrigatória'),
  position: z.string().min(1, 'Cargo obrigatório'),
  phone: z.string().min(8, 'Telefone inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
});

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirmação obrigatória'),
  profile: profileSchema,
}).refine((d) => d.password === d.confirmPassword, { path: ['confirmPassword'], message: 'Senhas não coincidem' });

type FormData = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm<FormData>({ 
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = async (data: FormData) => {
    await api.register({ email: data.email, password: data.password, profile: data.profile });
    await login(data.email, data.password);
    navigate('/home', { replace: true });
  };

  return (
    <div className="center" style={{ padding: 24 }}>
      <div className="card" style={{ width: 420 }}>
        <h1 style={{ margin: 0, marginBottom: 8, textAlign: 'center', color: 'var(--cdo-primary)' }}>Criar conta</h1>
        <p style={{ marginTop: 0, textAlign: 'center', opacity: .8 }}>Preencha seus dados</p>
        <form onSubmit={handleSubmit(onSubmit)} className="stack" style={{ gap: 16 }}>
          <div>
            <label>Email</label>
            <input type="email" {...register('email')} aria-invalid={!!errors.email} />
            {errors.email && <small style={{ color: '#e74c3c' }}>{errors.email.message}</small>}
          </div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <label>Senha</label>
              <input type="password" {...register('password')} aria-invalid={!!errors.password} />
              {errors.password && <small style={{ color: '#e74c3c' }}>{errors.password.message}</small>}
            </div>
            <div style={{ flex: 1 }}>
              <label>Confirmar senha</label>
              <input type="password" {...register('confirmPassword')} aria-invalid={!!errors.confirmPassword} />
              {errors.confirmPassword && <small style={{ color: '#e74c3c' }}>{errors.confirmPassword.message}</small>}
            </div>
          </div>
          <fieldset style={{ border: 0, padding: 0 }}>
            <legend style={{ fontWeight: 700, marginBottom: 8 }}>Perfil</legend>
            <div className="stack">
              <div>
                <label>Nome completo</label>
                <input {...register('profile.name')} />
                {errors.profile?.name && <small style={{ color: '#e74c3c' }}>{errors.profile.name.message}</small>}
              </div>
              <div>
                <label>Empresa</label>
                <input {...register('profile.company')} />
                {errors.profile?.company && <small style={{ color: '#e74c3c' }}>{errors.profile.company.message}</small>}
              </div>
              <div>
                <label>Cargo</label>
                <input {...register('profile.position')} />
                {errors.profile?.position && <small style={{ color: '#e74c3c' }}>{errors.profile.position.message}</small>}
              </div>
              <div className="row">
                <div style={{ flex: 1 }}>
                  <label>Telefone</label>
                  <input {...register('profile.phone')} />
                  {errors.profile?.phone && <small style={{ color: '#e74c3c' }}>{errors.profile.phone.message}</small>}
                </div>
                <div style={{ flex: 1 }}>
                  <label>CPF</label>
                  <input {...register('profile.cpf')} />
                  {errors.profile?.cpf && <small style={{ color: '#e74c3c' }}>{errors.profile.cpf.message}</small>}
                </div>
              </div>
            </div>
          </fieldset>
          <button className="btn" disabled={!isValid || isSubmitting || isLoading} type="submit">{(isSubmitting || isLoading) ? 'Criando...' : 'Registrar'}</button>
        </form>
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <span>Já tem conta? </span>
          <Link to="/login">Entrar</Link>
        </div>
      </div>
    </div>
  );
}


