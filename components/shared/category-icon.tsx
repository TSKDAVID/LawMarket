import {
  Briefcase,
  Users,
  Globe,
  Home,
  FileText,
  Landmark,
  Shield,
  Stamp,
  Scale,
  type LucideProps,
} from "lucide-react";

const iconMap = {
  briefcase: Briefcase,
  users: Users,
  globe: Globe,
  home: Home,
  "file-text": FileText,
  landmark: Landmark,
  shield: Shield,
  stamp: Stamp,
} as const;

export type CategoryIconName = keyof typeof iconMap;

export function CategoryIcon({
  name,
  ...props
}: LucideProps & { name: string }) {
  const Icon = iconMap[name as CategoryIconName] ?? Scale;
  return <Icon {...props} />;
}
