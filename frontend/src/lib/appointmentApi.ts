// ─── Auth Types ──────────────────────────────────────────────────────
export interface LoginResponse {
  token: string;
  admin: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
}

// ─── Auth Functions ──────────────────────────────────────────────────

const TOKEN_KEY = 'shiv-shakti-auth-token';
const ADMIN_KEY = 'shiv-shakti-admin';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredAdmin(): AdminUser | null {
  const data = localStorage.getItem(ADMIN_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveAuth(token: string, admin: LoginResponse['admin']): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Auth API ────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Login failed');
  }
  const data: LoginResponse = await res.json();
  saveAuth(data.token, data.admin);
  return data;
}

export async function verifyToken(): Promise<AdminUser> {
  const res = await fetch('/api/auth/me', {
    headers: authHeaders(),
  });
  if (!res.ok) {
    clearAuth();
    throw new Error('Token invalid');
  }
  return res.json();
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const res = await fetch('/api/auth/change-password', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to change password');
  }
}

export function logout(): void {
  clearAuth();
  window.location.href = '/doctor/login';
}

// ─── Appointment Types ───────────────────────────────────────────────
export interface Appointment {
  _id: string;
  patientName: string;
  email: string;
  mobile: string;
  date: string;
  timeSlot: string;
  concern: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  doctorNotes: string;
  bookedAt: string;
}

export interface BookedSlot {
  timeSlot: string;
  status: string;
}

export interface DashboardStats {
  today: number;
  pending: number;
  confirmed: number;
  total: number;
}

// ─── Public Appointment APIs (no auth) ───────────────────────────────

export async function createAppointment(data: {
  patientName: string;
  email: string;
  mobile: string;
  date: string;
  timeSlot: string;
  concern: string;
}): Promise<Appointment> {
  const res = await fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create appointment');
  }
  return res.json();
}

export async function getBookedSlots(date: string): Promise<BookedSlot[]> {
  const res = await fetch(`/api/appointments/slots/${date}`);
  if (!res.ok) throw new Error('Failed to fetch slots');
  return res.json();
}

// ─── Protected Dashboard APIs (requires auth) ───────────────────────

export async function getAppointments(params?: {
  status?: string;
  search?: string;
  date?: string;
}): Promise<Appointment[]> {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  if (params?.date) query.set('date', params.date);

  const res = await fetch(`/api/dashboard/appointments?${query.toString()}`, {
    headers: authHeaders(),
  });
  if (res.status === 401) {
    clearAuth();
    window.location.href = '/doctor/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return res.json();
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch('/api/dashboard/stats', {
    headers: authHeaders(),
  });
  if (res.status === 401) {
    clearAuth();
    window.location.href = '/doctor/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function updateAppointmentStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
): Promise<Appointment> {
  const res = await fetch(`/api/dashboard/appointments/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  if (res.status === 401) {
    clearAuth();
    window.location.href = '/doctor/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

export async function updateDoctorNotes(
  id: string,
  doctorNotes: string
): Promise<Appointment> {
  const res = await fetch(`/api/dashboard/appointments/${id}/notes`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ doctorNotes }),
  });
  if (res.status === 401) {
    clearAuth();
    window.location.href = '/doctor/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error('Failed to update notes');
  return res.json();
}

export function getExportUrl(params?: {
  status?: string;
  search?: string;
  date?: string;
}): string {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  if (params?.date) query.set('date', params.date);
  // For protected export, we pass token as query param
  const token = getToken();
  if (token) query.set('token', token);
  return `/api/dashboard/export?${query.toString()}`;
}
