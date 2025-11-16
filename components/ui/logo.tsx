import { Video } from "lucide-react";
import Link from "next/link";

export const Logo = ({iconColor="text-secondary",textColor="bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent"}:{iconColor?:string,textColor?:string}) => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-pink-400">
        <Video className={`w-6 h-6 text-secondary ${iconColor}`} />
      </div>
      <h1 className={`self-baseline text-2xl font-bold ${textColor}`}>
        VideoMania
      </h1>
    </Link>
  );
};

export default Logo;
