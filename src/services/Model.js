const API_BASE_URL = 'https://naradev-backendup-production.up.railway.app';

const ENDPOINTS = {
  registerUser: '/auth/register/user',
  loginUser: '/auth/login/user',
  loginAdmin: '/auth/login/admin',
  contacts: '/contacts',
  articles: '/articles',
  bookmarks: '/bookmarks',
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

export async function fetchPaginatedArticles(page, limit) {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.articles}?page=${page}&limit=${limit}`);
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

export async function fetchCommentsByArticleId(articleId) {
  const response = await fetch(`${API_BASE_URL}/articles/${articleId}/comments`);
  return handleResponse(response);
}

export async function postCommentToArticle(articleId, text) {
  const token = getTokenOrThrow();
  const response = await fetch(`${API_BASE_URL}/articles/${articleId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  return handleResponse(response);
}

export async function addBookmark(articleId) {
  const token = getTokenOrThrow();
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.bookmarks}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ articleId }),
  });

  return handleResponse(response);
}

export async function fetchUserBookmarks() {
  const token = getTokenOrThrow();
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.bookmarks}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function deleteBookmark(articleId) {
  const token = getTokenOrThrow();
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.bookmarks}/${articleId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}
