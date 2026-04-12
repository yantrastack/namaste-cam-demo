import type { ReactNode } from "react";

/** Full-width surface canvas inside the dashboard main column (matches admin user mockup). */
export function UserModuleCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-6 -mb-6 min-h-[calc(100%-0.5rem)] bg-surface px-4 pb-28 pt-2 sm:px-6 md:pb-10 lg:px-10 lg:pt-6">
      {children}
    </div>
  );
}

export function UserScreenToolbar({ title }: { title: string }) {
  return (
    <div className="mb-6 border-b border-stone-200/60 pb-4">
      <p className="font-headline text-lg font-extrabold tracking-tight text-primary">
        <span className="mr-2 font-normal text-stone-400">/</span>
        {title}
      </p>
    </div>
  );
}
