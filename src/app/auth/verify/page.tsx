"use client";

import { useState } from "react";
import { verifyEmail } from "../../../services/authService";
import { toast } from "sonner";

export default function VerifyCodePage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    try {
      await verifyEmail(email, code);
      toast.success("Xác minh thành công!");
      setMessage("Xác minh thành công!");
    } catch (err) {
      setMessage((err as Error).message);
      toast.error("Xác minh thất bại!");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2>Mã xác nhận</h2>
      <input
        className="input mt-2"
        placeholder="Mã xác nhận"
        value={code}
        required
        onChange={(e) => setCode(e.target.value)}
      />
      <button className="btn mt-4" onClick={handleVerify}>
        Xác minh
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
