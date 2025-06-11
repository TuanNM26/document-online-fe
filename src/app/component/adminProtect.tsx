import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "../../hooks/customHooks";

interface UseAdminGuardOptions {
  redirectTo?: string;
}

export function useAdminGuard(options?: UseAdminGuardOptions) {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.role?.roleName === "admin";
  const isCurrentUserLoading = currentUser == undefined;
  const redirectTo = options?.redirectTo || "/";
  useEffect(() => {
    if (!isCurrentUserLoading && !isAdmin) {
      router.replace(redirectTo);
    }
  }, [isCurrentUserLoading, isAdmin, router, redirectTo]);
}
