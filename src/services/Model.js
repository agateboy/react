const API_BASE_URL = 'https://naradev-backendup-production.up.railway.app';

const ENDPOINTS = {
  registerUser: '/auth/register/user',
  loginUser: '/auth/login/user',
  loginAdmin: '/auth/login/admin',
  contacts: '/contacts',
  articles: '/articles',
};

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan');
  }
  return data;
}

function getTokenOrThrow() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token tidak ditemukan. Silakan login ulang.');
  }
  return token;
}


export async function registerUser({ username, email, password }) {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.registerUser}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  return handleResponse(response);
}

export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.loginUser}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
}


export async function loginAdmin({ email, password }) {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.loginAdmin}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
}

export async function sendContactMessage({ fullname, email, phone, subject, message }) {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.contacts}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullname, email, phone, subject, message }),
  });

  return handleResponse(response);
}

export async function fetchContacts() {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.contacts}`);
  return handleResponse(response);
}


export async function fetchAllArticles() {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.articles}`);
  return handleResponse(response);
}

export async function fetchArticleById(id) {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.articles}/${id}`);
  return handleResponse(response);
}

export async function createArticle({ title, content }) {
  const token = getTokenOrThrow();
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.articles}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });

  return handleResponse(response);
}

export async function updateArticle(id, { title, content }) {
  const token = getTokenOrThrow();
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.articles}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });

  return handleResponse(response);
}

export async function deleteArticle(id) {
  const token = getTokenOrThrow();
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.articles}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function fetchArticleBySlug(slug) {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.articles}/slug/${slug}`);
  return handleResponse(response);
}

