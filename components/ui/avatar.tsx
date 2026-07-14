interface AvatarProps {
  src: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "h-10 w-10 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-base",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({ src, name, size = "sm", className = "" }: AvatarProps) {
  if (src) {
    return (
      <div
        className={`overflow-hidden rounded-full border border-border bg-background ${sizeStyles[size]} ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full border border-border bg-primary/10 font-semibold text-primary ${sizeStyles[size]} ${className}`}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
}
