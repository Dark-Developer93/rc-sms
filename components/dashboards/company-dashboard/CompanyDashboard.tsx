"use client";

import { useState } from "react";
import Nav from "@/components/nav/Nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Candidate,
  InternshipPosition,
  ScheduledInterviews,
} from "@/types/dashboard";
import { mockCandidates, mockPositions } from "@/mocks/dashboardData";

export default function CompanyDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [scheduledInterviews, setScheduledInterviews] =
    useState<ScheduledInterviews>({});
  const [positions, setPositions] =
    useState<InternshipPosition[]>(mockPositions);

  const filterCandidatesBySkill = (skill: string) => {
    if (skill === "") {
      setCandidates(mockCandidates);
    } else {
      setCandidates(
        mockCandidates.filter((candidate) =>
          candidate.skills.some((s) =>
            s.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }
  };

  const handleScheduleInterview = (
    id: number,
    date: string,
    time: string,
    notes: string
  ): void => {
    setScheduledInterviews((prev) => ({
      ...prev,
      [id]: { date, time, notes },
    }));
  };

  const handleAddPosition = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPosition: InternshipPosition = {
      id: positions.length + 1,
      title: formData.get("position-title") as string,
      department: formData.get("department") as string,
      location: formData.get("location") as string,
      status: formData.get("status") as "open" | "closed",
      applicants: 0,
    };
    setPositions([...positions, newPosition]);
  };

  const handleDeletePosition = (id: number): void => {
    setPositions(positions.filter((position) => position.id !== id));
  };

  const handleEditPosition = (
    id: number,
    updatedPosition: Partial<InternshipPosition>
  ): void => {
    setPositions(
      positions.map((position) =>
        position.id === id ? { ...position, ...updatedPosition } : position
      )
    );
  };

  return (
    <div>
      <Nav role="company" />
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6">Company Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Management</CardTitle>
              <CardDescription>Edit company details</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Edit Profile</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Company Profile</DialogTitle>
                    <DialogDescription>
                      Update your company&apos;s information.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input
                        id="company-name"
                        defaultValue="Tech Innovations Inc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="company-description">
                        Company Description
                      </Label>
                      <Textarea
                        id="company-description"
                        defaultValue="We are a leading tech company specializing in innovative solutions."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        defaultValue="Information Technology"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        defaultValue="https://techinnovations.com"
                      />
                    </div>
                    <Button type="submit">Update Profile</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          <Card id="manage-positions">
            <CardHeader>
              <CardTitle>Internship Positions</CardTitle>
              <CardDescription>Manage open positions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="#manage-positions">Manage Positions</a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Interview Schedule</CardTitle>
              <CardDescription>
                View and manage upcoming interviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="#Interview Schedule">View Schedule</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6" id="manage-positions">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Internship Positions</CardTitle>
                <CardDescription>
                  Manage your internship listings
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Position</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Position</DialogTitle>
                    <DialogDescription>
                      Create a new internship position listing.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleAddPosition}>
                    <div>
                      <Label htmlFor="position-title">Position Title</Label>
                      <Input
                        id="position-title"
                        name="position-title"
                        placeholder="e.g., Frontend Developer Intern"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        placeholder="e.g., Engineering"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="e.g., Remote, Hybrid, or Office Location"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select name="status" defaultValue="open">
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit">Create Position</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {positions.map((position) => (
                <div
                  key={position.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{position.title}</h3>
                    <div className="text-sm text-muted-foreground">
                      {position.department} · {position.location}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground">
                      {position.applicants} applicants
                    </div>
                    <Badge
                      variant={
                        position.status === "open" ? "default" : "secondary"
                      }
                    >
                      {position.status}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Position</DialogTitle>
                          <DialogDescription>
                            Update the internship position details.
                          </DialogDescription>
                        </DialogHeader>
                        <form
                          className="space-y-4"
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            handleEditPosition(position.id, {
                              title: formData.get("position-title") as string,
                              department: formData.get("department") as string,
                              location: formData.get("location") as string,
                            });
                          }}
                        >
                          <div>
                            <Label htmlFor={`position-title-${position.id}`}>
                              Position Title
                            </Label>
                            <Input
                              id={`position-title-${position.id}`}
                              name="position-title"
                              defaultValue={position.title}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`department-${position.id}`}>
                              Department
                            </Label>
                            <Input
                              id={`department-${position.id}`}
                              name="department"
                              defaultValue={position.department}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`location-${position.id}`}>
                              Location
                            </Label>
                            <Input
                              id={`location-${position.id}`}
                              name="location"
                              defaultValue={position.location}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`status-${position.id}`}>
                              Status
                            </Label>
                            <Select
                              name="status"
                              defaultValue={position.status}
                              onValueChange={(value) =>
                                handleEditPosition(position.id, {
                                  status: value as "open" | "closed",
                                })
                              }
                            >
                              <SelectTrigger id={`status-${position.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button type="submit">Update Position</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePosition(position.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card id="Interview Schedule">
          <CardHeader>
            <CardTitle>Matched Candidates</CardTitle>
            <CardDescription>
              Review and manage potential interns
            </CardDescription>
            <Input
              placeholder="Filter by skill..."
              onChange={(e) => filterCandidatesBySkill(e.target.value)}
              className="mt-2"
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      <div className="flex space-x-2 mt-1">
                        {candidate.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">
                      {candidate.matchPercentage}% Match
                    </Badge>
                    {scheduledInterviews[candidate.id] ? (
                      <div className="text-sm">
                        <p>
                          Interview: {scheduledInterviews[candidate.id].date} at{" "}
                          {scheduledInterviews[candidate.id].time}
                        </p>
                      </div>
                    ) : (
                      <div className="space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">View Profile</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                {candidate.name}&apos;s Profile
                              </DialogTitle>
                              <DialogDescription>
                                Detailed information about the candidate.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Skills</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {candidate.skills.map((skill, index) => (
                                    <Badge key={index}>{skill}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label>Match Percentage</Label>
                                <p>{candidate.matchPercentage}%</p>
                              </div>
                              <div>
                                <Label>About</Label>
                                <p className="text-sm text-muted-foreground">
                                  A motivated student with a passion for
                                  technology and innovation.
                                </p>
                              </div>
                              <div>
                                <Label>Projects</Label>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                  <li>E-commerce platform</li>
                                  <li>
                                    Machine learning model for sentiment
                                    analysis
                                  </li>
                                  <li>Mobile app for task management</li>
                                </ul>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">Schedule Interview</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Schedule Interview</DialogTitle>
                              <DialogDescription>
                                Select a date and time for the interview with{" "}
                                {candidate.name}.
                              </DialogDescription>
                            </DialogHeader>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(
                                  e.target as HTMLFormElement
                                );
                                const interviewDate = formData.get(
                                  "interview-date"
                                ) as string;
                                const interviewTime = formData.get(
                                  "interview-time"
                                ) as string;
                                const interviewNotes = formData.get(
                                  "interview-notes"
                                ) as string;
                                handleScheduleInterview(
                                  candidate.id,
                                  interviewDate,
                                  interviewTime,
                                  interviewNotes
                                );
                              }}
                              className="space-y-4"
                            >
                              <div>
                                <Label htmlFor="interview-date">Date</Label>
                                <Input
                                  id="interview-date"
                                  name="interview-date"
                                  type="date"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="interview-time">Time</Label>
                                <Input
                                  id="interview-time"
                                  name="interview-time"
                                  type="time"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="interview-notes">Notes</Label>
                                <Textarea
                                  id="interview-notes"
                                  name="interview-notes"
                                  placeholder="Add any notes about the interview"
                                />
                              </div>
                              <Button type="submit">Schedule Interview</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
