import { Role } from "@/types/role";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function fetchRoles(token: string): Promise<Role[]> {
  try {
    const res = await fetch(`${API_URL}/roles`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch roles: ${res.statusText}`);
    }

    const data = await res.json();
    return data as Role[];
  } catch (error) {
    return [];
  }
}

export async function deleteRole(
  roleId: string,
  token: string
): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/roles/${roleId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to delete role: ${res.statusText}`);
    }

    return true;
  } catch (error) {
    return false;
  }
}

export async function createRole(
  role: {
    roleName: string;
    description: string;
  },
  token: string
): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(role),
    });
    return res.ok;
  } catch (error) {
    return false;
  }
}

export async function fetchRoleById(
  id: string,
  token: string
): Promise<Role | null> {
  try {
    const res = await fetch(`${API_URL}/roles/${id}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch role");
    const data = await res.json();
    return data as Role;
  } catch (error) {
    return null;
  }
}

export async function updateRole(
  id: string,
  payload: { roleName: string; description?: string },
  token: string
): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/roles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (error) {
    return false;
  }
}
