"use client";

import { useActionState } from "react";
import { submitExpatAction, type ExpatFormState } from "@/app/(dashboard)/dashboard/expat-applications/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const initial: ExpatFormState = {};

export function ExpatApplyForm(): React.JSX.Element {
  const [state, action, pending] = useActionState(submitExpatAction, initial);

  return (
    <form action={action} className="space-y-4 border border-border bg-paper-alt/40 p-6">
      <h2 className="font-display text-xl">ახალი განაცხადი</h2>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="residency" className="mt-1" />
        <span>ცხოვრობთ საქართველოში როგორც უცხოელი / ექსპატი</span>
      </label>
      <div className="space-y-2">
        <Label htmlFor="matter_type">საკითხის ტიპი</Label>
        <select
          id="matter_type"
          name="matter_type"
          required
          className="flex h-10 w-full rounded-sm border border-border bg-paper px-3 text-sm"
        >
          <option value="">აირჩიეთ...</option>
          <option value="ვიზა">ვიზა</option>
          <option value="ბინადრობა">ბინადრობა</option>
          <option value="შრომა">შრომა</option>
          <option value="ბიზნესი">ბიზნესი</option>
          <option value="სხვა">სხვა</option>
        </select>
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="urgency" className="mt-1" />
        <span>სასწრაფოა</span>
      </label>
      {state.error ? <p className="text-sm text-seal">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-ink">განაცხადი გაიგზავნა.</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "..." : "გაგზავნა"}
      </Button>
    </form>
  );
}
