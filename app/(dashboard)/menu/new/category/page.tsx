import { redirect } from "next/navigation";

export default function MenuNewCategoryRedirectPage() {
  redirect("/menu/categories?add=category");
}
