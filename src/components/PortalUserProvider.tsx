"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, AuthSessionUser } from "@/types/auth";
import { getCurrentUserProfile } from "@/app/actions/authActions";

export interface PortalUserContextType {
  role: "student" | "teacher";
  profile: UserProfile | null;
  user: AuthSessionUser | null;
  isTeacher: boolean;
  isStudent: boolean;
}

const PortalUserContext = createContext<PortalUserContextType>({
  role: "student",
  profile: null,
  user: null,
  isTeacher: false,
  isStudent: true,
});

export function PortalUserProvider({
  children,
  initialRole,
  initialProfile,
  initialUser,
}: {
  children: React.ReactNode;
  initialRole?: "student" | "teacher";
  initialProfile?: UserProfile | null;
  initialUser?: AuthSessionUser | null;
}) {
  const [role, setRole] = useState<"student" | "teacher">(
    initialRole || "student",
  );
  const [profile, setProfile] = useState<UserProfile | null>(
    initialProfile || null,
  );
  const [user, setUser] = useState<AuthSessionUser | null>(initialUser || null);

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
    if (initialProfile) {
      setProfile(initialProfile);
    }
    if (initialUser) {
      setUser(initialUser);
    }

    if (!initialRole) {
      getCurrentUserProfile().then(({ session, profile }) => {
        const determinedRole =
          profile?.role || session?.role || "student";
        setRole(determinedRole);
        setProfile(profile || null);
        setUser(session || null);
      });
    }
  }, [initialRole, initialProfile, initialUser]);

  const isTeacher = role === "teacher";
  const isStudent = role === "student";

  return (
    <PortalUserContext.Provider
      value={{
        role,
        profile,
        user,
        isTeacher,
        isStudent,
      }}
    >
      {children}
    </PortalUserContext.Provider>
  );
}

export function usePortalUser() {
  return useContext(PortalUserContext);
}

