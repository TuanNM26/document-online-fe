import { User } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const fetchUsers = async (token: string) => {
  const res = await fetch(`${API_URL}/users`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await res.json();
  return data.data;
};

export async function deleteUser(
  userId: string,
  token: string
): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to delete user: ${res.statusText}`);
    }

    return true;
  } catch (error) {
    return false;
  }
}

export async function fetchUserById(
  id: string,
  token: string
): Promise<User | null> {
  try {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data as User;
  } catch (error) {
    return null;
  }
}

export async function updateUser(
  id: string,
  token: string,
  body: { username: string; email: string; role: string }
): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    return res.ok;
  } catch (error) {
    return false;
  }
}
