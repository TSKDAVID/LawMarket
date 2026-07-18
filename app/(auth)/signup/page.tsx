import { SignupForm } from "@/components/auth/auth-forms";

export default function SignupPage(): React.JSX.Element {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">რეგისტრაცია</h1>
      <p className="mt-2 text-sm text-ink-muted">
        პროფილი იქმნება ავტომატურად — შემდეგ აირჩევთ როლს.
      </p>
      <div className="mt-8">
        <SignupForm />
      </div>
    </div>
  );
}
