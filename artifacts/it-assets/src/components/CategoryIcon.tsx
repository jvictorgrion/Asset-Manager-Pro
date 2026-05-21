import { Laptop, Monitor, Server, Cpu, Network, Package, HardDrive } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Laptop: Laptop,
  Desktop: Cpu,
  Monitor: Monitor,
  Server: Server,
  Peripheral: HardDrive,
  Networking: Network,
  Other: Package,
};

interface CategoryIconProps {
  category: string;
  className?: string;
}

export function CategoryIcon({ category, className = "h-4 w-4" }: CategoryIconProps) {
  const Icon = CATEGORY_ICONS[category] ?? Package;
  return <Icon className={className} />;
}
