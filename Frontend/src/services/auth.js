const DEMO_CREDENTIALS = {
  email: "admin@hardware.com",
  password: "demo1234",
};

export async function loginUser(credentials) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Unable to sign in right now.");
    }

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("pos_token", data.token);
    }

    return data;
  } catch (error) {
    if (
      credentials.email === DEMO_CREDENTIALS.email &&
      credentials.password === DEMO_CREDENTIALS.password
    ) {
      const demoToken = "demo-jwt-token";
      localStorage.setItem("pos_token", demoToken);
      return {
        token: demoToken,
        user: {
          email: credentials.email,
          role: "admin",
          name: "Demo Admin",
        },
      };
    }

    throw error;
  }
}

export function logoutUser() {
  localStorage.removeItem("pos_token");
}

export function getStoredToken() {
  return localStorage.getItem("pos_token");
}
