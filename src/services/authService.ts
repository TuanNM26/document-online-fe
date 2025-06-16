const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
export async function verifyEmail(email: string, code: string) {
  const res = await fetch(`${API_URL}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  if (!res.ok) throw new Error("Xác minh thất bại");
  return;
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw new Error("Gửi mã xác nhận thất bại");
  return;
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string
) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, newPassword }),
  });

  if (!res.ok) throw new Error("Đặt lại mật khẩu thất bại");
  return;
}

export const login = async (email: string, password: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );

  if (!res.ok) {
    let message = "Đăng nhập thất bại.";
    try {
      const errorData = await res.json();
      message = errorData.message || message;
    } catch (_) {}
    throw new Error(message);
  }

  const data = await res.json();
  return data;
};

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        roleId: "684668708bfa41d5dc6b1547",
      }),
    }
  );

  if (!res.ok) {
    let message = "Đăng ký thất bại.";
    try {
      const errorData = await res.json();
      message = errorData.message || message;
    } catch (_) {}
    throw new Error(message);
  }
  return;
};
