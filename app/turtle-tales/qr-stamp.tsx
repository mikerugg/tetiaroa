const cells = [
  1, 1, 1, 0, 1, 1,
  1, 0, 1, 0, 0, 1,
  1, 1, 1, 0, 1, 1,
  0, 0, 1, 1, 0, 0,
  1, 0, 1, 1, 1, 0,
  1, 1, 0, 0, 1, 1,
];

export function QrStamp({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      {cells.map((cell, index) => (
        <span key={index} data-filled={cell ? "true" : "false"} />
      ))}
    </div>
  );
}
