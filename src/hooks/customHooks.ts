"use client";

import { useState, useEffect } from "react";
import { getUserFromToken, JwtPayload } from "../utils/jwt";

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<JwtPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const user = getUserFromToken(token);
      setCurrentUser(user);
    }
  }, []);

  return currentUser;
}
