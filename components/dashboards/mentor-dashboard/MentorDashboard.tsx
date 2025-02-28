"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ProjectEvaluation,
  WeeklyEvaluation,
  EvaluationStatus,
} from "@/types/dashboard";
import {
  mockEvaluations,
  mockGroupProgress,
  mockWeeklyEvaluations,
} from "@/mocks/dashboardData";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { EvaluationDialog } from "@/components/dashboard/EvaluationDialog";
import { FormDialog } from "@/components/dashboard/FormDialog";

export default function MentorDashboard() {
  const [evaluations, setEvaluations] =
    useState<ProjectEvaluation[]>(mockEvaluations);
  const [weeklyEvaluations, setWeeklyEvaluations] = useState<
    WeeklyEvaluation[]
  >(mockWeeklyEvaluations);

  const [mentorStudents] = useState([
    "John Doe",
    "Jane Smith",
    "Alice Johnson",
    // Add more students as needed
  ]);

  const handleSubmitEvaluation = (
    id: number,
    evaluationStatus: EvaluationStatus
  ): void => {
    setEvaluations(
      evaluations.map((projectEvaluation) =>
        projectEvaluation.id === id
          ? { ...projectEvaluation, evaluationStatus }
          : projectEvaluation
      )
    );
  };

  const handleSubmitWeeklyEvaluation = (
    id: number,
    technicalSkills: number,
    weeklyProgress: number,
    notes: string,
    lastUpdated: Date
  ): void => {
    setWeeklyEvaluations(
      weeklyEvaluations.map((weeklyEvaluation) =>
        weeklyEvaluation.id === id
          ? {
              ...weeklyEvaluation,
              technicalSkills,
              weeklyProgress: weeklyEvaluation.weeklyProgress + 1,
              notes,
              lastUpdated,
            }
          : weeklyEvaluation
      )
    );
  };

  const handleAddWeeklyEvaluation = (data: {
    studentName: string;
    technicalSkills: number;
    feedback: string;
  }) => {
    const newEvaluation: WeeklyEvaluation = {
      id: weeklyEvaluations.length + 1,
      studentName: data.studentName,
      technicalSkills: data.technicalSkills,
      weeklyProgress: 1,
      notes: data.feedback,
      lastUpdated: new Date(),
    };

    setWeeklyEvaluations([...weeklyEvaluations, newEvaluation]);
  };

  return (
    <DashboardLayout role="mentor" title="Mentor Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Assigned Group Tracking"
          description="View EPFL course progress of assigned students"
          action={{
            type: "link",
            href: "#group-progress",
            text: "View Group Progress",
          }}
        />
        <DashboardCard
          title="Assigned Evaluations"
          description="View and submit evaluations for assigned students"
          action={{
            type: "link",
            href: "#evaluations",
            text: "Manage Evaluations",
          }}
        />
        <DashboardCard
          title="Weekly Performance Evaluations"
          description="Evaluate each member in your assigned group"
          action={{
            type: "link",
            href: "#weekly-evaluations",
            text: "Perform Evaluations",
          }}
        />
        <DashboardCard
          title="Schedule Group Standup"
          description="Schedule a standup meeting for your assigned group"
          action={{
            type: "form",
            text: "Schedule Standup",
            form: {
              title: "Schedule Group Standup",
              description:
                "Set the date and time for your group's standup meeting.",
              fields: [
                {
                  id: "standup-date",
                  label: "Date",
                  type: "date",
                  required: true,
                },
                {
                  id: "standup-time",
                  label: "Time",
                  type: "time",
                  required: true,
                },
                {
                  id: "standup-location",
                  label: "Location",
                  type: "text",
                  placeholder: "Enter location or meeting link",
                  required: true,
                },
              ],
              onSubmit: (formData) => {
                console.log("Standup scheduled:", formData);
                // Handle form submission
              },
            },
          }}
        />
      </div>

      <Card id="group-progress" className="mb-8">
        <CardHeader>
          <CardTitle>Assigned Group Progress</CardTitle>
          <CardDescription>
            EPFL course progress of your assigned students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockGroupProgress.map((student) => (
              <div key={student.id} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{student.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {student.progress}%
                  </span>
                </div>
                <Progress value={student.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card id="evaluations" className="mb-8">
        <CardHeader>
          <CardTitle>Assigned Evaluations</CardTitle>
          <CardDescription>
            Overview of your assigned student evaluations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable<Record<string, React.ReactNode> & ProjectEvaluation>
            columns={[
              { header: "Student Name", accessor: "studentName" },
              { header: "Project Name", accessor: "projectName" },
              { header: "Due Date", accessor: "dueDate" },
              {
                header: "Technical Skills",
                accessor: (evaluation) => `${evaluation.technicalSkills}/5`,
              },
              {
                header: "Evaluation",
                accessor: (evaluation) =>
                  evaluation.evaluationStatus && (
                    <Badge
                      variant={
                        evaluation.evaluationStatus === "passed"
                          ? "default"
                          : evaluation.evaluationStatus === "failed"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {evaluation.evaluationStatus}
                    </Badge>
                  ),
              },
              { header: "Feedback", accessor: "feedback" },
            ]}
            data={
              evaluations as (Record<string, React.ReactNode> &
                ProjectEvaluation)[]
            }
            actions={(evaluation) => (
              <EvaluationDialog
                studentName={evaluation.studentName}
                type="project"
                onSubmit={(data) =>
                  handleSubmitEvaluation(evaluation.id, data.evaluationStatus!)
                }
                defaultValues={{
                  technicalSkills: evaluation.technicalSkills,
                  feedback: evaluation.feedback,
                  evaluationStatus: evaluation.evaluationStatus,
                }}
              />
            )}
          />
        </CardContent>
      </Card>

      <Card id="weekly-evaluations" className="mb-8">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Weekly Performance Evaluations</span>
            <FormDialog
              buttonText="Add Evaluation"
              title="Add Weekly Evaluation"
              description="Add a new weekly evaluation for a student"
              fields={[
                {
                  id: "studentName",
                  label: "Student",
                  type: "select",
                  options: mentorStudents,
                  required: true,
                },
                {
                  id: "technicalSkills",
                  label: "Technical Skills (1-5)",
                  type: "select",
                  options: ["1", "2", "3", "4", "5"],
                  required: true,
                },
                {
                  id: "feedback",
                  label: "Notes",
                  type: "textarea",
                  placeholder: "Add evaluation notes...",
                  required: true,
                },
              ]}
              onSubmit={(data) => {
                handleAddWeeklyEvaluation({
                  studentName: data.studentName,
                  technicalSkills: parseInt(data.technicalSkills),
                  feedback: data.feedback,
                });
              }}
            />
          </CardTitle>
          <CardDescription>
            Evaluate the technical skills and weekly progress of your assigned
            group
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable<Record<string, React.ReactNode> & WeeklyEvaluation>
            columns={[
              { header: "Student Name", accessor: "studentName" },
              {
                header: "Technical Skills",
                accessor: (row) => `${row.technicalSkills}/5`,
              },
              {
                header: "Weekly Progress",
                accessor: (row) => `${row.weeklyProgress}/5`,
              },
              { header: "Notes", accessor: "notes" },
              {
                header: "Last Updated",
                accessor: (row) => row.lastUpdated?.toLocaleString(),
              },
            ]}
            data={
              weeklyEvaluations as (Record<string, React.ReactNode> &
                WeeklyEvaluation)[]
            }
            actions={(evaluation) => (
              <EvaluationDialog
                studentName={evaluation.studentName}
                type="weekly"
                onSubmit={(data) =>
                  handleSubmitWeeklyEvaluation(
                    evaluation.id,
                    data.technicalSkills,
                    evaluation.weeklyProgress,
                    data.feedback,
                    new Date()
                  )
                }
                defaultValues={{
                  technicalSkills: evaluation.technicalSkills,
                  weeklyProgress: evaluation.weeklyProgress,
                  feedback: evaluation.notes,
                }}
              />
            )}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
