"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, signupAction, type AuthActionState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: AuthActionState = {};

export function LoginForm({ nextPath }: { nextPath?: string }): React.JSX.Element {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="space-y-4">
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
      <div className="space-y-2">
        <Label htmlFor="email">ელფოსტა</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">პაროლი</Label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </div>
      {state.error ? <p className="text-sm text-seal">{state.error}</p> : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "..." : "შესვლა"}
      </Button>
      <p className="text-sm text-ink-muted">
        არ გაქვს ანგარიში?{" "}
        <Link href="/signup" className="text-seal underline-offset-4 hover:underline">
          რეგისტრაცია
        </Link>
      </p>
    </form>
  );
}

export function SignupForm(): React.JSX.Element {
  const [state, action, pending] = useActionState(signupAction, initial);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">სრული სახელი</Label>
        <Input id="fullName" name="fullName" required autoComplete="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">ელფოსტა</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">პაროლი</Label>
        <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      {state.error ? <p className="text-sm text-seal">{state.error}</p> : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "..." : "ანგარიშის შექმნა"}
      </Button>
      <p className="text-sm text-ink-muted">
        უკვე გაქვს ანგარიში?{" "}
        <Link href="/login" className="text-seal underline-offset-4 hover:underline">
          შესვლა
        </Link>
      </p>
    </form>
  );
}
