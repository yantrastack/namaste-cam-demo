import { redirect } from "next/navigation";

export default function MenuNewSubcategoryRedirectPage() {
  redirect("/menu/categories?add=subcategory");
}
