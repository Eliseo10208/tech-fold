const paths = {
  external: "M7 17 17 7M7 7h10v10",
  right: "M5 12h14m-6-6 6 6-6 6",
  left: "M19 12H5m6-6-6 6 6 6",
  down: "M12 5v14m-6-6 6 6 6-6",
} as const;

// SVG avoids platform-specific emoji rendering of Unicode arrows on iOS.
export function ArrowIcon({ direction = "external" }: { direction?: keyof typeof paths }) {
  return (
    <svg className="arrow-icon" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={paths[direction]} />
    </svg>
  );
}
