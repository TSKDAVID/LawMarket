import { redirect } from "next/navigation";

/** Root entry for static hosting / GitHub Pages — default locale is Georgian. */
export default function RootPage() {
  redirect("/ka");
}
