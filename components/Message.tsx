import { type LucideIcon } from "lucide-react";

interface MessageProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}

export default function Message({ Icon, title, description }: MessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="max-w-xs text-center text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}