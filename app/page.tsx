import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Student Management System</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Admin</CardTitle>
            <CardDescription>Manage the entire system</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Access user management, program oversight, and more.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mentor</CardTitle>
            <CardDescription>Guide and evaluate students</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Track student progress and submit evaluations.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/mentor">Mentor Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Student</CardTitle>
            <CardDescription>Track your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View courses, submit projects, and manage interviews.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/student">Student Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Company</CardTitle>
            <CardDescription>Manage internships</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View matched students and manage interviews.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/company">Company Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
