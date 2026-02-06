/**
 * A wrapper around the native fetch that handles 401 (Unauthorized) responses
 * by clearing auth state and redirecting to the login page.
 */
export class UnauthorizedError extends Error {
  constructor(message = "Session expired") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, init);

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-storage");

      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {
        // Ignore errors during logout
      }

      window.location.href = "/auth/login";
    }

    throw new UnauthorizedError();
  }

  return response;
}
