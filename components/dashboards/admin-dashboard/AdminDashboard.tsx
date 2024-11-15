"use client";

import { useState, FormEvent } from "react";

import Nav from "@/components/nav/Nav";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/types/dashboard";
import {
  mockUsers,
  mockProgramData,
  mockEvaluationData,
  mockStudentMetrics,
  mockWorkshops,
  mockStudentProgress,
} from "@/mocks/dashboardData";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [workshops, setWorkshops] = useState<Workshop[]>(mockWorkshops);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

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

  const handleWorkshopFormSubmit = (
    e: FormEvent<HTMLFormElement>,
    formType: "add" | "edit",
    workshopId?: number
  ): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const workshopData: NewWorkshopFormData = {
      title: formData.get("title") as string,
      type: formData.get("type") as Workshop["type"],
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      location: formData.get("location") as string,
    };

    if (formType === "add") {
      handleAddWorkshop(workshopData);
    } else if (formType === "edit" && workshopId) {
      handleEditWorkshop(workshopId, workshopData);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  return (
    <div>
      <Nav role="admin" />
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="#user-management">Manage Users</a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>EPFL Program Oversight</CardTitle>
              <CardDescription>Monitor program progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="#program-oversight">View Program</a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance Evaluations</CardTitle>
              <CardDescription>Track and manage evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="#performance-evaluations">Manage Evaluations</a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Workshop Scheduler</CardTitle>
              <CardDescription>Manage workshops and events</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="#workshop-scheduler">Schedule Workshops</a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Student Progress</CardTitle>
              <CardDescription>Track student progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="#student-progress">View Progress</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card id="user-management" className="mb-8">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Overview of all users in the system
            </CardDescription>
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
                    <TableCell>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Overall Score</TableHead>
                    <TableHead>Technical Skills</TableHead>
                    <TableHead>Soft Skills</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStudentMetrics.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.overallScore.toFixed(1)}</TableCell>
                      <TableCell>
                        {student.technicalSkills.toFixed(1)}
                      </TableCell>
                      <TableCell>{student.softSkills.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Schedule New Workshop</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule New Workshop</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new workshop or event.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => handleWorkshopFormSubmit(e, "add")}
                  >
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="Enter workshop title" />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select workshop type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">
                            Technical Session
                          </SelectItem>
                          <SelectItem value="soft-skills">
                            Soft Skills Session
                          </SelectItem>
                          <SelectItem value="english">
                            English Practice Session
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" type="time" />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="Enter location or 'Online'"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() =>
                        handleAddWorkshop({
                          title: "New Workshop",
                          type: "technical",
                          date: "2024-05-01",
                          time: "14:00",
                          location: "Room 101",
                          attendees: 0,
                        })
                      }
                    >
                      Schedule Workshop
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
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
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="mr-2">
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Workshop</DialogTitle>
                            <DialogDescription>
                              Update the workshop details.
                            </DialogDescription>
                          </DialogHeader>
                          <form
                            className="space-y-4"
                            onSubmit={(e) =>
                              handleWorkshopFormSubmit(e, "edit", workshop.id)
                            }
                          >
                            <div>
                              <Label htmlFor="edit-title">Title</Label>
                              <Input
                                id="edit-title"
                                defaultValue={workshop.title}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-type">Type</Label>
                              <Select defaultValue={workshop.type}>
                                <SelectTrigger id="edit-type">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="technical">
                                    Technical Session
                                  </SelectItem>
                                  <SelectItem value="soft-skills">
                                    Soft Skills Session
                                  </SelectItem>
                                  <SelectItem value="english">
                                    English Practice Session
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit-date">Date</Label>
                              <Input
                                id="edit-date"
                                type="date"
                                defaultValue={workshop.date}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-time">Time</Label>
                              <Input
                                id="edit-time"
                                type="time"
                                defaultValue={workshop.time}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-location">Location</Label>
                              <Input
                                id="edit-location"
                                defaultValue={workshop.location}
                              />
                            </div>
                            <Button
                              type="button"
                              onClick={() =>
                                handleEditWorkshop(workshop.id, {
                                  title: "Updated Workshop",
                                  type: workshop.type,
                                  date: "2024-05-15",
                                  time: "15:00",
                                  location: "Room 202",
                                  attendees: workshop.attendees,
                                })
                              }
                            >
                              Update Workshop
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
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
      </main>
    </div>
  );
}
