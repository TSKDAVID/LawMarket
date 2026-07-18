"use client";

import { useActionState, useState } from "react";
import { onboardingAction, type AuthActionState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: AuthActionState = {};

export function OnboardingForm({
  defaultName,
}: {
  defaultName: string;
}): React.JSX.Element {
  const [state, action, pending] = useActionState(onboardingAction, initial);
  const [role, setRole] = useState<"client" | "provider">("client");

  return (
    <form action={action} className="space-y-5">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-ink">ვინ ხართ?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          <label
            className={`cursor-pointer border px-4 py-3 text-sm ${
              role === "client" ? "border-seal bg-paper-alt" : "border-border"
            }`}
          >
            <input
              type="radio"
              name="role"
              value="client"
              className="sr-only"
              checked={role === "client"}
              onChange={() => setRole("client")}
            />
            კლიენტი
          </label>
          <label
            className={`cursor-pointer border px-4 py-3 text-sm ${
              role === "provider" ? "border-seal bg-paper-alt" : "border-border"
            }`}
          >
            <input
              type="radio"
              name="role"
              value="provider"
              className="sr-only"
              checked={role === "provider"}
              onChange={() => setRole("provider")}
            />
            იურისტი / პროვაიდერი
          </label>
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="fullName">სრული სახელი</Label>
        <Input id="fullName" name="fullName" required defaultValue={defaultName} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">ქალაქი</Label>
        <Input id="city" name="city" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">ტელეფონი</Label>
        <Input id="phone" name="phone" />
      </div>
      {role === "provider" ? (
        <div className="space-y-2">
          <Label htmlFor="lawFirm">იურიდიული ფირმა</Label>
          <Input id="lawFirm" name="lawFirm" />
        </div>
      ) : null}

      {state.error ? <p className="text-sm text-seal">{state.error}</p> : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "..." : "გაგრძელება"}
      </Button>
    </form>
  );
}
