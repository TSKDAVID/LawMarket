import Link from "next/link";

export default function HowItWorksPage(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl">როგორ მუშაობს</h1>
      <p className="mt-4 text-ink-muted leading-relaxed">
        აღმოაჩინეთ პროვაიდერი, შეაფასეთ დადასტურებული საქმეები და დაჯავშნეთ უსაფრთხოდ. დეტალური ნაბიჯები
        ეტაპობრივად დაემატება.
      </p>
      <Link href="/providers" className="mt-8 inline-block text-seal underline-offset-4 hover:underline">
        პროვაიდერების ნახვა →
      </Link>
    </div>
  );
}
