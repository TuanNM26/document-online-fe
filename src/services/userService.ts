import { User } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function fetchUsers(): Promise<User[]> {
  try {
    const res = await fetch(`${API_URL}/users`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.statusText}`);
    }

    const data = await res.json();
    return data.data as User[];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Failed to delete user: ${res.statusText}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting user with id ${userId}:`, error);
    return false;
  }
}

export async function fetchUserById(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/${id}`
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export async function updateUser(
  id: string,
  body: { username: string; email: string; role: string }
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  return res.ok;
}
