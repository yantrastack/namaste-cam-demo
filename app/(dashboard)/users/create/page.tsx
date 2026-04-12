import { redirect } from "next/navigation";

export default function LegacyUserCreatePage() {
  redirect("/users/new");
}
