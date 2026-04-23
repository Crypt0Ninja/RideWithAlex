type LessonTypeCardProps = {
  title: string;
  description: string;
  includes: string[];
  duration: string;
  level: string;
};

export function LessonTypeCard({
  title,
  description,
  includes,
  duration,
  level,
}: LessonTypeCardProps) {
  return (
    <article className="bg-neutral-900 rounded-3xl p-8 flex flex-col gap-6 border border-white/5">
      <header>
        <h2 className="text-white text-3xl md:text-4xl font-medium lowercase tracking-tight">
          {title}
        </h2>
        <p className="text-white/70 text-sm md:text-base leading-relaxed lowercase mt-3">
          {description}
        </p>
      </header>

      <ul className="flex flex-col gap-2 text-sm text-white/90 lowercase border-t border-white/10 pt-6">
        {includes.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span aria-hidden className="mt-2 block h-px w-3 bg-white/40" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <footer className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-xs text-white/50 lowercase">
        <div>
          <p className="text-white/30 uppercase tracking-widest text-[10px] mb-1">
            duration
          </p>
          <p className="text-white/80">{duration}</p>
        </div>
        <div>
          <p className="text-white/30 uppercase tracking-widest text-[10px] mb-1">
            level
          </p>
          <p className="text-white/80">{level}</p>
        </div>
      </footer>
    </article>
  );
}
