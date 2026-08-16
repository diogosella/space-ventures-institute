import Image from "next/image";

type LogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function Logo({ size = 40, className, priority }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Space Ventures Institute logo"
      width={size}
      height={size}
      className={className}
      priority={priority}
    />
  );
}
