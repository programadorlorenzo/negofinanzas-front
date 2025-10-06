// Función para limpiar todas las cookies de NextAuth
export function clearAuthCookies() {
  if (typeof window !== 'undefined') {
    // Lista de cookies de NextAuth que necesitamos limpiar
    const authCookies = [
      'next-auth.session-token',
      'next-auth.callback-url',
      'next-auth.csrf-token',
      '__Secure-next-auth.session-token',
      '__Host-next-auth.csrf-token',
      'next-auth.pkce.code_verifier'
    ];

    authCookies.forEach(cookieName => {
      // Limpiar cookie en diferentes rutas y dominios
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost;`;
    });

    // También limpiar localStorage y sessionStorage
    localStorage.clear();
    sessionStorage.clear();
  }
}