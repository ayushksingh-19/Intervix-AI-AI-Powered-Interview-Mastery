export const clerkPublishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

export const isClerkClientConfigured = Boolean(clerkPublishableKey);

export const isClerkServerConfigured = Boolean(
  clerkPublishableKey && process.env.CLERK_SECRET_KEY
);
