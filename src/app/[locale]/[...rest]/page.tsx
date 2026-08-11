import { notFound } from "next/navigation";

/** Any path not matched by a real route renders the branded § 404. */
export default function CatchAll() {
  notFound();
}
