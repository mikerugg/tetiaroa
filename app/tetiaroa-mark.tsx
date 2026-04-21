export function TetiaroaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="9" ry="4" />
      <circle cx="8" cy="11" r="0.6" fill="currentColor" />
      <circle cx="14" cy="13" r="0.6" fill="currentColor" />
      <circle cx="16.5" cy="10.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
