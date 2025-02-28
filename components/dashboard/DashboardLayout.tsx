import Nav from "@/components/nav/Nav";

interface DashboardLayoutProps {
  role: "admin" | "mentor" | "student" | "company";
  title: string;
  children: React.ReactNode;
}

export function DashboardLayout({
  role,
  title,
  children,
}: DashboardLayoutProps) {
  return (
    <div>
      <Nav role={role} />
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        {children}
      </main>
    </div>
  );
}
