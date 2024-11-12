import Link from "next/link";
import { Button } from "@/components/ui/button";

const Nav = ({
  role,
}: {
  role: "admin" | "mentor" | "student" | "company";
}) => {
  return (
    <nav className="flex justify-between items-center p-4 bg-secondary">
      <Link href="/" className="text-2xl font-bold">
        RC IMS
      </Link>
      <div className="space-x-2">
        <Button variant="ghost" asChild>
          <Link href="/">Dashboards</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href={`/${role}`}>Dashboard</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href={`/${role}/profile`}>Profile</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/logout">Logout</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Nav;
