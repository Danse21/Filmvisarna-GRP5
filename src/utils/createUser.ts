export type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type CreateUserResult =
  | { ok: true }
  | { ok: false; error: string };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function createUser(
  input: CreateUserInput,
): Promise<CreateUserResult> {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const email = input.email.trim();

  if (!firstName || !lastName || !email || !input.password) {
    return { ok: false, error: "Alla falt maste fyllas i." };
  }

  if (!isValidEmail(email)) {
    return { ok: false, error: "Fyll i en giltig e-postadress." };
  }

  if (input.password !== input.confirmPassword) {
    return { ok: false, error: "Losenorden matchar inte." };
  }

  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password: input.password,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    return {
      ok: false,
      error: data.error ?? "Det gick inte att skapa anvandaren.",
    };
  }

  return { ok: true };
}
