import { Role } from "@/types/role";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
export async function fetchRoles(): Promise<Role[]> {
  try {
    const res = await fetch(`${API_URL}/roles`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch roles: ${res.statusText}`);
    }

    const data = await res.json();
    return data as Role[];
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
}

export async function deleteRole(roleId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/roles/${roleId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Failed to delete user: ${res.statusText}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting user with id ${roleId}:`, error);
    return false;
  }
}

export async function createRole(role: {
  roleName: string;
  description: string;
}): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(role),
    });

    return res.ok;
  } catch (error) {
    console.error("Error creating role:", error);
    return false;
  }
}

export async function fetchRoleById(id: string): Promise<Role | null> {
  try {
    const res = await fetch(`${API_URL}/roles/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch role");
    const data = await res.json();
    return data as Role;
  } catch (error) {
    console.error("Error fetching role:", error);
    return null;
  }
}

export async function updateRole(
  id: string,
  payload: { roleName: string; description?: string }
): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/roles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (error) {
    console.error("Error updating role:", error);
    return false;
  }
}
