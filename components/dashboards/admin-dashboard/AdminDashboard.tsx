"use client";

import { useState, FormEvent } from "react";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { EvaluationDialog } from "@/components/dashboard/EvaluationDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  User,
  Workshop,
  NewUserFormData,
  NewWorkshopFormData,
  StudentUser,
  MentorUser,
  AdminUser,
  CompanyUser,
  StudentMetric,
} from "@/types/dashboard";
import {
  mockUsers,
  mockProgramData,
  mockEvaluationData,
  mockStudentMetrics,
  mockWorkshops,
  mockStudentProgress,
  mockMatches,
  mockCompanies,
  mockStudents,
} from "@/mocks/dashboardData";
import { FormDialog } from "@/components/dashboard/FormDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/dashboard/DataTable";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [workshops, setWorkshops] = useState<Workshop[]>(mockWorkshops);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [studentMetrics, setStudentMetrics] =
    useState<StudentMetric[]>(mockStudentMetrics);
  const [matches, setMatches] = useState(mockMatches);

  const createUserByRole = (
    baseData: {
      id: number;
      name: string;
      email: string;
      role: User["role"];
    },
    cohortData?: { cohort: number }
  ): User => {
    switch (baseData.role) {
      case "student":
        if (!cohortData?.cohort)
          throw new Error("Cohort is required for students");
        return {
          ...baseData,
          role: "student",
          cohort: cohortData.cohort,
        } as StudentUser;

      case "mentor":
        if (!cohortData?.cohort)
          throw new Error("Cohort is required for mentors");
        return {
          ...baseData,
          role: "mentor",
          cohort: cohortData.cohort,
        } as MentorUser;

      case "admin":
        return {
          ...baseData,
          role: "admin",
        } as AdminUser;

      case "company":
        return {
          ...baseData,
          role: "company",
        } as CompanyUser;

      default:
        throw new Error("Invalid user role");
    }
  };

  const handleUserUpsert = (
    userData: NewUserFormData,
    userId?: number
  ): void => {
    const isEdit = userId !== undefined;

    setUsers((currentUsers) => {
      if (isEdit) {
        return currentUsers.map((user) => {
          if (user.id !== userId) return user;

          const newRole = userData.role || user.role;
          let cohortData: { cohort: number } | undefined;

          if (newRole === "student" || newRole === "mentor") {
            cohortData = {
              cohort:
                userData.cohort || (user as StudentUser | MentorUser).cohort,
            };
          }

          return createUserByRole(
            {
              id: user.id,
              name: userData.name || user.name,
              email: userData.email || user.email,
              role: newRole,
            },
            cohortData
          );
        });
      } else {
        const newUser = createUserByRole(
          {
            id: currentUsers.length + 1,
            name: userData.name,
            email: userData.email,
            role: userData.role,
          },
          userData.cohort ? { cohort: userData.cohort } : undefined
        );
        return [...currentUsers, newUser];
      }
    });
  };

  const handleUserFormSubmit = (
    e: FormEvent<HTMLFormElement>,
    formType: "add" | "edit",
    userId?: number
  ): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const role = formData.get("role") as User["role"];

    const userData: NewUserFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: role,
    };

    if (role === "student" || role === "mentor") {
      const cohortValue = formData.get("cohort");
      if (cohortValue) {
        userData.cohort = parseInt(cohortValue as string);
      }
    }

    handleUserUpsert(userData, formType === "edit" ? userId : undefined);

    if (formType === "add") {
      setIsAddModalOpen(false);
    } else {
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteUser = (id: number): void => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleAddWorkshop = (workshopData: NewWorkshopFormData): void => {
    const newWorkshop: Workshop = {
      id: workshops.length + 1,
      attendees: 0,
      ...workshopData,
    };
    setWorkshops([...workshops, newWorkshop]);
  };

  const handleEditWorkshop = (
    id: number,
    updatedWorkshop: Partial<Workshop>
  ): void => {
    setWorkshops(
      workshops.map((workshop) =>
        workshop.id === id ? { ...workshop, ...updatedWorkshop } : workshop
      )
    );
  };

  const handleDeleteWorkshop = (id: number): void => {
    setWorkshops(workshops.filter((workshop) => workshop.id !== id));
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateStudentMetrics = (
    studentId: number,
    data: {
      technicalSkills: number;
      softSkills: number;
      overallScore: number;
      feedback: string;
    }
  ) => {
    setStudentMetrics(
      studentMetrics.map((student) =>
        student.id === studentId
          ? {
              ...student,
              technicalSkills: data.technicalSkills,
              softSkills: data.softSkills,
              overallScore: data.overallScore,
              feedback: data.feedback,
            }
          : student
      )
    );
  };

  const handleMatchSubmit = (formData: Record<string, string>) => {
    const company = mockCompanies.find((c) => c.name === formData.company);
    const student = mockStudents.find((s) => s.name === formData.student);

    if (company && student) {
      const newMatch = {
        id: matches.length + 1,
        studentName: student.name,
        companyName: company.name,
        position: formData.position,
        matchDate: new Date().toISOString().split("T")[0],
        status: formData.status as "matched" | "pending",
      };

      setMatches([...matches, newMatch]);
    }
  };

  const handleDeleteMatch = (id: number): void => {
    setMatches(matches.filter((match) => match.id !== id));
  };

  return (
    <DashboardLayout role="admin" title="Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="User Management"
          description="Manage users in the system"
          action={{
            type: "link",
            href: "#user-management",
            text: "Manage Users",
          }}
        />
        <DashboardCard
          title="EPFL Program Oversight"
          description="Monitor program progress"
          action={{
            type: "link",
            href: "#program-oversight",
            text: "View Program",
          }}
        />
        <DashboardCard
          title="Performance Evaluations"
          description="Track and manage evaluations"
          action={{
            type: "link",
            href: "#performance-evaluations",
            text: "Manage Evaluations",
          }}
        />
        <DashboardCard
          title="Workshop Scheduler"
          description="Manage workshops and events"
          action={{
            type: "link",
            href: "#workshop-scheduler",
            text: "Schedule Workshops",
          }}
        />
        <DashboardCard
          title="Student Progress"
          description="Track student progress"
          action={{
            type: "link",
            href: "#student-progress",
            text: "View Progress",
          }}
        />
        <DashboardCard
          title="Company Matching"
          description="Match students with companies"
          action={{
            type: "link",
            href: "#company-matching",
            text: "Match Students",
          }}
        />
      </div>

      <Card id="user-management" className="mb-8">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Overview of all users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  Add New User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new user.
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={(e) => handleUserFormSubmit(e, "add")}
                >
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      name="role"
                      onValueChange={(value) => {
                        const cohortField =
                          document.getElementById("cohort-field");
                        if (cohortField) {
                          cohortField.style.display =
                            value === "student" || value === "mentor"
                              ? "block"
                              : "none";
                        }
                      }}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="mentor">Mentor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div id="cohort-field" style={{ display: "none" }}>
                    <Label htmlFor="cohort">Cohort</Label>
                    <Select name="cohort">
                      <SelectTrigger id="cohort">
                        <SelectValue placeholder="Select cohort" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Cohort 1</SelectItem>
                        <SelectItem value="2">Cohort 2</SelectItem>
                        <SelectItem value="3">Cohort 3</SelectItem>
                        <SelectItem value="4">Cohort 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit">Add User</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Cohort</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.role === "student" || user.role === "mentor"
                      ? user.cohort
                      : "-"}
                  </TableCell>
                  <TableCell className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Update the user&apos;s details.
                </DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) =>
                  handleUserFormSubmit(e, "edit", editingUser?.id)
                }
              >
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    placeholder="Enter name"
                    defaultValue={editingUser?.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    defaultValue={editingUser?.email}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    name="role"
                    defaultValue={editingUser?.role}
                    onValueChange={(value) => {
                      const cohortField =
                        document.getElementById("edit-cohort-field");
                      if (cohortField) {
                        cohortField.style.display =
                          value === "student" || value === "mentor"
                            ? "block"
                            : "none";
                      }
                    }}
                  >
                    <SelectTrigger id="edit-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="mentor">Mentor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div
                  id="edit-cohort-field"
                  style={{
                    display:
                      editingUser?.role === "student" ||
                      editingUser?.role === "mentor"
                        ? "block"
                        : "none",
                  }}
                >
                  <Label htmlFor="edit-cohort">Cohort</Label>
                  <Select
                    name="cohort"
                    defaultValue={(
                      editingUser as StudentUser | MentorUser
                    )?.cohort?.toString()}
                  >
                    <SelectTrigger id="edit-cohort">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Cohort 1</SelectItem>
                      <SelectItem value="2">Cohort 2</SelectItem>
                      <SelectItem value="3">Cohort 3</SelectItem>
                      <SelectItem value="4">Cohort 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Update User</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card id="program-oversight" className="mb-8">
        <CardHeader>
          <CardTitle>EPFL Program Oversight</CardTitle>
          <CardDescription>
            Monitor program progress and student enrollment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockProgramData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="students"
                fill="#8884d8"
                name="Enrolled Students"
              />
              <Bar
                yAxisId="right"
                dataKey="completionRate"
                fill="#82ca9d"
                name="Completion Rate (%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card id="performance-evaluations" className="mb-8">
        <CardHeader>
          <CardTitle>Performance Evaluations</CardTitle>
          <CardDescription>
            Average scores across different skills and individual student
            metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              Overall Skill Averages
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockEvaluationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgScore" fill="#8884d8" name="Average Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Individual Student Metrics
            </h3>
            <DataTable<Record<string, React.ReactNode> & StudentMetric>
              columns={[
                {
                  header: "Student Name",
                  accessor: (student) => student.name,
                },
                {
                  header: "Overall Score",
                  accessor: (student) => student.overallScore.toFixed(1),
                },
                {
                  header: "Technical Skills",
                  accessor: (student) => student.technicalSkills.toFixed(1),
                },
                {
                  header: "Soft Skills",
                  accessor: (student) => student.softSkills.toFixed(1),
                },
                {
                  header: "Feedback",
                  accessor: (student) => student.feedback || "-",
                },
              ]}
              data={
                studentMetrics as (Record<string, React.ReactNode> &
                  StudentMetric)[]
              }
              actions={(student) => (
                <EvaluationDialog
                  studentName={student.name}
                  type="project"
                  onSubmit={(data) => {
                    handleUpdateStudentMetrics(student.id, {
                      technicalSkills: data.technicalSkills,
                      softSkills: data.softSkills,
                      overallScore: data.overallScore,
                      feedback: data.feedback,
                    });
                  }}
                  defaultValues={{
                    technicalSkills: student.technicalSkills,
                    softSkills: student.softSkills,
                    overallScore: student.overallScore,
                    feedback: student.feedback || "",
                    evaluationStatus: "passed",
                  }}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card id="workshop-scheduler" className="mb-8">
        <CardHeader>
          <CardTitle>Workshop Scheduler</CardTitle>
          <CardDescription>
            Manage upcoming workshops, events, and practice sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <FormDialog
              buttonText="Schedule New Workshop"
              title="Schedule New Workshop"
              description="Enter the details for the new workshop or event."
              fields={[
                {
                  id: "title",
                  label: "Title",
                  type: "text",
                  placeholder: "Enter workshop title",
                  required: true,
                },
                {
                  id: "type",
                  label: "Type",
                  type: "select",
                  required: true,
                  options: [
                    "Technical Session",
                    "Soft Skills Session",
                    "English Practice Session",
                  ],
                },
                {
                  id: "date",
                  label: "Date",
                  type: "date",
                  required: true,
                },
                {
                  id: "time",
                  label: "Time",
                  type: "time",
                  required: true,
                },
                {
                  id: "location",
                  label: "Location",
                  type: "select",
                  required: true,
                  options: ["Online (Google Meet)", "Office"],
                },
              ]}
              onSubmit={(formData) => {
                handleAddWorkshop({
                  title: formData.title,
                  type: formData.type
                    .toLowerCase()
                    .split(" ")[0] as Workshop["type"],
                  date: formData.date,
                  time: formData.time,
                  location: formData.location,
                  attendees: 0,
                });
              }}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workshop Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workshops.map((workshop) => (
                <TableRow key={workshop.id}>
                  <TableCell>{workshop.title}</TableCell>
                  <TableCell>{workshop.type}</TableCell>
                  <TableCell>{workshop.date}</TableCell>
                  <TableCell>{workshop.time}</TableCell>
                  <TableCell>{workshop.location}</TableCell>
                  <TableCell>{workshop.attendees}</TableCell>
                  <TableCell className="flex space-x-2">
                    <FormDialog
                      buttonText="Edit"
                      buttonSize="sm"
                      buttonVariant="outline"
                      title="Edit Workshop"
                      description="Update the workshop details."
                      fields={[
                        {
                          id: "title",
                          label: "Title",
                          type: "text",
                          required: true,
                          defaultValue: workshop.title,
                        },
                        {
                          id: "type",
                          label: "Type",
                          type: "select",
                          required: true,
                          options: [
                            "Technical Session",
                            "Soft Skills Session",
                            "English Practice Session",
                          ],
                          defaultValue:
                            workshop.type.charAt(0).toUpperCase() +
                            workshop.type.slice(1) +
                            " Session",
                        },
                        {
                          id: "date",
                          label: "Date",
                          type: "date",
                          required: true,
                          defaultValue: workshop.date,
                        },
                        {
                          id: "time",
                          label: "time",
                          type: "time",
                          required: true,
                          defaultValue: workshop.time,
                        },
                        {
                          id: "location",
                          label: "Location",
                          type: "select",
                          required: true,
                          options: ["Online", "Office"],
                          defaultValue: workshop.location,
                        },
                      ]}
                      onSubmit={(formData) => {
                        handleEditWorkshop(workshop.id, {
                          title: formData.title,
                          type: formData.type
                            .toLowerCase()
                            .split(" ")[0] as Workshop["type"],
                          date: formData.date,
                          time: formData.time,
                          location: formData.location,
                          attendees: workshop.attendees,
                        });
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteWorkshop(workshop.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card id="student-progress" className="mb-8">
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
          <CardDescription>
            Overall progress of students in the program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockStudentProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="progress" fill="#82ca9d" name="Progress (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card id="company-matching" className="mb-8">
        <CardHeader>
          <CardTitle>Company-Student Matches</CardTitle>
          <CardDescription>
            Overview of all company-student matches
          </CardDescription>
          <div className="mb-4">
            <FormDialog
              buttonText="Create New Match"
              title="Create New Match"
              description="Match a student with a company"
              fields={[
                {
                  id: "student",
                  label: "Student",
                  type: "select",
                  required: true,
                  options: mockStudents.map((student) => student.name),
                },
                {
                  id: "company",
                  label: "Company",
                  type: "select",
                  required: true,
                  options: mockCompanies.map((company) => company.name),
                },
                {
                  id: "position",
                  label: "Position",
                  type: "select",
                  required: true,
                  options: [
                    "Frontend Developer",
                    "Backend Developer",
                    "Data Analyst",
                    "Cloud Engineer",
                  ],
                },
                {
                  id: "status",
                  label: "Status",
                  type: "select",
                  required: true,
                  options: ["matched", "pending"],
                },
                {
                  id: "notes",
                  label: "Notes",
                  type: "textarea",
                  placeholder: "Add any additional notes about this match",
                },
              ]}
              onSubmit={handleMatchSubmit}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Match Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>{match.studentName}</TableCell>
                  <TableCell>{match.companyName}</TableCell>
                  <TableCell>{match.position}</TableCell>
                  <TableCell>{match.matchDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        match.status === "matched" ? "default" : "secondary"
                      }
                    >
                      {match.status.charAt(0).toUpperCase() +
                        match.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex space-x-2">
                    <FormDialog
                      buttonText="Edit"
                      buttonSize="sm"
                      buttonVariant="outline"
                      title="Edit Match"
                      description="Update the match details"
                      fields={[
                        {
                          id: "student",
                          label: "Student",
                          type: "select",
                          required: true,
                          options: mockStudents.map((student) => student.name),
                          defaultValue: match.studentName,
                        },
                        {
                          id: "company",
                          label: "Company",
                          type: "select",
                          required: true,
                          options: mockCompanies.map((company) => company.name),
                          defaultValue: match.companyName,
                        },
                        {
                          id: "position",
                          label: "Position",
                          type: "select",
                          required: true,
                          options: [
                            "Frontend Developer",
                            "Backend Developer",
                            "Data Analyst",
                            "Cloud Engineer",
                          ],
                          defaultValue: match.position,
                        },
                        {
                          id: "status",
                          label: "Status",
                          type: "select",
                          required: true,
                          options: ["matched", "pending"],
                          defaultValue: match.status,
                        },
                        {
                          id: "notes",
                          label: "Notes",
                          type: "textarea",
                          placeholder:
                            "Add any additional notes about this match",
                        },
                      ]}
                      onSubmit={(formData) => {
                        setMatches(
                          matches.map((m) =>
                            m.id === match.id
                              ? {
                                  ...m,
                                  studentName: formData.student,
                                  companyName: formData.company,
                                  position: formData.position,
                                  status: formData.status as
                                    | "matched"
                                    | "pending",
                                }
                              : m
                          )
                        );
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteMatch(match.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
