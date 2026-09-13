export async function loginUser(credentials) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to sign in right now.");
  }

  return data;
}

export async function getCurrentUser() {
  const response = await fetch("/api/auth/session", {
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function logoutUser() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}
