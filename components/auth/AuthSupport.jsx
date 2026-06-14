"use client";

import Link from "next/link";
import React from "react";
import { SignIn, SignUp, UserButton, useAuth, useUser } from "@clerk/nextjs";

export const GUEST_EMAIL = "guest@local.dev";

const isClerkClientConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

const guestUser = {
  firstName: "Guest",
  lastName: "User",
  fullName: "Guest User",
  primaryEmailAddress: {
    emailAddress: GUEST_EMAIL,
  },
};

function AuthSetupNotice({ title }) {
  return (
    <div className="w-full max-w-md rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6">
        Add <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and{" "}
        <code>CLERK_SECRET_KEY</code> to <code>.env.local</code> to enable
        authentication. You can still explore the app in guest mode from the
        dashboard.
      </p>
      <div className="mt-4">
        <Link
          href="/dashboard"
          className="inline-flex rounded-md bg-amber-900 px-4 py-2 text-sm font-medium text-white"
        >
          Continue in Guest Mode
        </Link>
      </div>
    </div>
  );
}

export function useOptionalUser() {
  if (!isClerkClientConfigured) {
    return {
      isLoaded: true,
      isSignedIn: false,
      user: guestUser,
    };
  }

  return useUser();
}

export function useOptionalAuth() {
  if (!isClerkClientConfigured) {
    return {
      isLoaded: true,
      isSignedIn: false,
      userId: null,
    };
  }

  return useAuth();
}

export function AuthUserButton() {
  if (!isClerkClientConfigured) {
    return (
      <div className="rounded-full border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600">
        Guest Mode
      </div>
    );
  }

  return <UserButton afterSignOutUrl="/" />;
}

export function AuthSignIn() {
  if (!isClerkClientConfigured) {
    return <AuthSetupNotice title="Clerk keys are missing in .env.local." />;
  }

  return <SignIn />;
}

export function AuthSignUp() {
  if (!isClerkClientConfigured) {
    return <AuthSetupNotice title="Sign up is unavailable until Clerk is configured." />;
  }

  return <SignUp />;
}
