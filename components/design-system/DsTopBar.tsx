import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

export function DsTopBar() {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-outline-variant/20 bg-surface-container-lowest/80 px-8 py-3 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-4">
        <span className="font-headline text-xl font-extrabold tracking-tight text-on-surface">
          Namaste Cam
        </span>
        <div className="ml-10 hidden h-full items-center gap-8 md:flex">
          <span className="border-b-2 border-primary py-1 font-bold text-primary transition-colors duration-200">
            Design System
          </span>
          <span className="py-1 text-on-surface-variant transition-colors duration-200">
            Components
          </span>
          <span className="py-1 text-on-surface-variant transition-colors duration-200">
            Resources
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="scale-95 p-2 text-on-surface-variant transition-transform hover:text-primary active:scale-90"
          aria-label="Notifications"
        >
          <MaterialIcon name="notifications" />
        </button>
        <button
          type="button"
          className="scale-95 p-2 text-on-surface-variant transition-transform hover:text-primary active:scale-90"
          aria-label="Settings"
        >
          <MaterialIcon name="settings" />
        </button>
        <div className="ml-2 h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary/10">
          <Image
            alt=""
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUYLNT_Ot1O6BhtX9G0VAUQAgoQpj0OfPpnFH6WUu36T1KDeyVZ2ZObrvf0w0JFJ144tShRGaHKh0Y5l4MYo4xwy3gyU_KwN-SEL8s_4CdtaoiaLrJOueLhxdA4ZfNRz1OxxG3RWq4XltrqPplZ0F2BTdfrAsL476d2gVpnHjjj2BWlous0nmjveuychaR10s0I1GYrxt44f8Whjx0C1zJjYc5hZIQLK5nGr-G6yJo9WEJCSJGTkYzmtkCMdSAsrpIxbVcuN2NILEd"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
        <Link
          href="/login"
          className="hidden text-sm font-bold text-primary underline-offset-4 hover:underline md:inline"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
