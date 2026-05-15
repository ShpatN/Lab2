import { LogOut } from "lucide-react";

type Props = {
  onClick: () => void | Promise<void>;
  className?: string;
};

const LogoutIconButton = ({ onClick, className = "" }: Props) => {
  return (
    <button onClick={onClick} className={`text-muted-foreground hover:text-foreground transition-colors ${className}`.trim()} aria-label="Logout">
      <LogOut className="w-4 h-4" />
    </button>
  );
};

export default LogoutIconButton;
