"use client";

import AuthLayoutShell from "@/components/auth/AuthLayoutShell";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthLayoutShell showBack backHref="/login">
      <ResetPasswordForm />
    </AuthLayoutShell>
  );
}
