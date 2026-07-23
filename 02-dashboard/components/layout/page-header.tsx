import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b8d84]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-serif text-[34px] leading-none tracking-[-0.035em] text-[#191a17] sm:text-[40px]">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-[13px] leading-5 text-[#72746c]">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}
