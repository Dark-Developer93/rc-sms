"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Candidate, InternshipPosition } from "@/types/dashboard";
import { mockCandidates, mockPositions } from "@/mocks/dashboardData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FormDialog } from "@/components/dashboard/FormDialog";

interface ScheduledInterview {
  date: string;
  time: string;
  interviewer: string;
  location: string;
  notes?: string;
  interviewDate: string;
  status?: "accepted" | "rejected" | "pending";
  decisionNotes?: string;
}

export default function CompanyDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [scheduledInterviews, setScheduledInterviews] = useState<
    Record<string, ScheduledInterview>
  >({});
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

  const handleAddPosition = (formData: Record<string, string>) => {
    const newPosition: InternshipPosition = {
      id: positions.length + 1,
      title: formData["position-title"],
      department: formData["department"],
      location: formData["location"],
      status: formData["status"] as "open" | "closed",
      applicants: 0,
    };
    setPositions([...positions, newPosition]);
  };

  const handleDeletePosition = (id: number): void => {
    setPositions(positions.filter((position) => position.id !== id));
  };

  return (
    <DashboardLayout role="company" title="Company Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Profile Management"
          description="Edit company details"
          action={{
            type: "form",
            text: "Edit Profile",
            form: {
              title: "Edit Company Profile",
              description: "Update your company information",
              fields: [
                {
                  id: "company-name",
                  label: "Company Name",
                  type: "text",
                  required: true,
                },
                {
                  id: "company-description",
                  label: "Description",
                  type: "textarea",
                  required: true,
                },
                {
                  id: "company-website",
                  label: "Website",
                  type: "text",
                  required: true,
                },
              ],
              onSubmit: (data) => console.log("Profile updated:", data),
            },
          }}
        />
        <DashboardCard
          title="Internship Positions"
          description="Manage open positions"
          action={{
            type: "form",
            text: "Add Position",
            form: {
              title: "Add New Position",
              description: "Create a new internship position",
              fields: [
                {
                  id: "position-title",
                  label: "Position Title",
                  type: "text",
                  required: true,
                },
                {
                  id: "department",
                  label: "Department",
                  type: "text",
                  required: true,
                },
                {
                  id: "location",
                  label: "Location",
                  type: "text",
                  required: true,
                },
                {
                  id: "status",
                  label: "Status",
                  type: "select",
                  required: true,
                  options: ["open", "closed"],
                },
              ],
              onSubmit: handleAddPosition,
            },
          }}
        />
      </div>

      <Card id="manage-positions" className="mb-8">
        <CardHeader>
          <CardTitle>Current Positions</CardTitle>
          <CardDescription>
            Overview of all internship positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable<Record<string, React.ReactNode> & InternshipPosition>
            columns={[
              { header: "Title", accessor: "title" },
              { header: "Department", accessor: "department" },
              { header: "Location", accessor: "location" },
              {
                header: "Status",
                accessor: (position) => (
                  <Badge
                    variant={
                      position.status === "open" ? "default" : "secondary"
                    }
                  >
                    {position.status}
                  </Badge>
                ),
              },
              { header: "Applicants", accessor: "applicants" },
            ]}
            data={
              positions as (Record<string, React.ReactNode> &
                InternshipPosition)[]
            }
            actions={(position) => (
              <div className="flex space-x-2">
                <FormDialog
                  buttonText="Edit"
                  buttonSize="sm"
                  buttonVariant="outline"
                  title="Edit Position"
                  description="Update the internship position details"
                  fields={[
                    {
                      id: "title",
                      label: "Position Title",
                      type: "text",
                      required: true,
                      placeholder: "Enter position title",
                      defaultValue: position.title,
                    },
                    {
                      id: "department",
                      label: "Department",
                      type: "text",
                      required: true,
                      placeholder: "Enter department",
                      defaultValue: position.department,
                    },
                    {
                      id: "location",
                      label: "Location",
                      type: "text",
                      required: true,
                      placeholder: "Enter location",
                      defaultValue: position.location,
                    },
                    {
                      id: "status",
                      label: "Status",
                      type: "select",
                      required: true,
                      options: ["open", "closed"],
                      defaultValue: position.status,
                    },
                  ]}
                  onSubmit={(data) => {
                    setPositions((prev) =>
                      prev.map((p) =>
                        p.id === position.id
                          ? {
                              ...p,
                              title: data.title,
                              department: data.department,
                              location: data.location,
                              status: data.status as "open" | "closed",
                            }
                          : p
                      )
                    );
                  }}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeletePosition(position.id)}
                >
                  Delete
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Card id="Interview Schedule">
        <CardHeader>
          <CardTitle>Matched Candidates</CardTitle>
          <CardDescription>Review and manage potential interns</CardDescription>
          <Input
            placeholder="Filter by skill..."
            onChange={(e) => filterCandidatesBySkill(e.target.value)}
            className="mt-2"
          />
        </CardHeader>
        <CardContent>
          <DataTable<Record<string, React.ReactNode> & Candidate>
            columns={[
              {
                header: "Name",
                accessor: (candidate) => (
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {String(candidate.name)
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{candidate.name}</span>
                  </div>
                ),
              },
              {
                header: "Skills",
                accessor: (candidate) => (
                  <div className="flex flex-wrap gap-2">
                    {(candidate.skills as string[]).map(
                      (skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      )
                    )}
                  </div>
                ),
              },
              {
                header: "Match",
                accessor: (candidate) => (
                  <Badge variant="outline">
                    {candidate.matchPercentage}% Match
                  </Badge>
                ),
              },
              {
                header: "Interview Date",
                accessor: (candidate) =>
                  scheduledInterviews[String(candidate.id)] ? (
                    <span className="text-sm">
                      {scheduledInterviews[String(candidate.id)].interviewDate}
                    </span>
                  ) : (
                    <Badge variant="secondary">Not Scheduled</Badge>
                  ),
              },
              {
                header: "Interview Status",
                accessor: (candidate) => {
                  const interview = scheduledInterviews[String(candidate.id)];
                  if (!interview)
                    return <Badge variant="secondary">Not Scheduled</Badge>;

                  const statusMap = {
                    accepted: "default",
                    rejected: "destructive",
                    pending: "secondary",
                  } as const;

                  const status = interview.status || "pending";
                  const statusVariant = statusMap[status];

                  return (
                    <Badge variant={statusVariant}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                  );
                },
              },
            ]}
            data={candidates as (Record<string, React.ReactNode> & Candidate)[]}
            actions={(candidate) => (
              <div className="space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">View Profile</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{candidate.name}&apos;s Profile</DialogTitle>
                      <DialogDescription>
                        Detailed information about the candidate.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Skills</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(candidate.skills as string[]).map(
                            (skill: string, index: number) => (
                              <Badge key={index}>{skill}</Badge>
                            )
                          )}
                        </div>
                      </div>
                      <div>
                        <Label>Match Percentage</Label>
                        <p>{candidate.matchPercentage}%</p>
                      </div>
                      <div>
                        <Label>About</Label>
                        <p className="text-sm text-muted-foreground">
                          A motivated student with a passion for technology and
                          innovation.
                        </p>
                      </div>
                      <div>
                        <Label>Projects</Label>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          <li>E-commerce platform</li>
                          <li>Machine learning model for sentiment analysis</li>
                          <li>Mobile app for task management</li>
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {!scheduledInterviews[String(candidate.id)] ? (
                  <FormDialog
                    buttonText="Schedule Interview"
                    title="Schedule Interview"
                    description={`Set up an interview with ${candidate.name}`}
                    fields={[
                      {
                        id: "interviewer",
                        label: "Interviewer",
                        type: "text",
                        placeholder: "Enter interviewer name",
                        required: true,
                      },
                      {
                        id: "location",
                        label: "Location",
                        type: "select",
                        required: true,
                        options: ["Online (Google Meet)", "Office"],
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
                        id: "notes",
                        label: "Additional Notes",
                        type: "textarea",
                        placeholder: "Add any additional notes or instructions",
                      },
                    ]}
                    onSubmit={(data) => {
                      setScheduledInterviews((prev) => ({
                        ...prev,
                        [String(candidate.id)]: {
                          date: data.date,
                          time: data.time,
                          interviewer: data.interviewer,
                          location: data.location,
                          notes: data.notes,
                          interviewDate: data.date,
                          status: "pending",
                        },
                      }));
                    }}
                  />
                ) : (
                  <FormDialog
                    buttonText="Decision"
                    title="Interview Decision"
                    description={`Update the interview status for ${candidate.name}`}
                    fields={[
                      {
                        id: "status",
                        label: "Status",
                        type: "select",
                        required: true,
                        options: ["accepted", "rejected", "pending"],
                      },
                      {
                        id: "decisionNotes",
                        label: "Notes",
                        type: "textarea",
                        placeholder: "Add any notes about your decision...",
                      },
                    ]}
                    onSubmit={(data) => {
                      setScheduledInterviews((prev) => ({
                        ...prev,
                        [String(candidate.id)]: {
                          ...prev[String(candidate.id)],
                          status: data.status as
                            | "accepted"
                            | "rejected"
                            | "pending",
                          decisionNotes: data.decisionNotes,
                        },
                      }));
                    }}
                  />
                )}
              </div>
            )}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
