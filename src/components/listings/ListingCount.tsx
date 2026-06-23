export function ListingCount({
  count,
  label,
}: {
  count: number;
  label: string;
}) {
  return (
    <p className="text-sm text-neutral-500">
      {count} {label}
      {count > 1 ? "s" : ""} trouvé{count > 1 ? "s" : ""}
    </p>
  );
}
