"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarEvent, CompanyMatch } from "@/types/dashboard";
import { mockCalendarEvents, mockCompanyMatches } from "@/mocks/dashboardData";

const StudentDashboard = () => {
  const [overallProgress, setOverallProgress] = useState<number>(59);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);

  const handleUpdateProgress = (): void => {
    const newProgress = Math.min(overallProgress + 1, 100);
    setOverallProgress(newProgress);
  };

  const handleDateSelect = (date: Date | undefined): void => {
    setSelectedDate(date);
    if (date) {
      const events =
        mockCalendarEvents.find(
          (event) => event.date.toDateString() === date.toDateString()
        )?.events || [];
      setSelectedEvents(events);
    } else {
      setSelectedEvents([]);
    }
  };

  return (
    <DashboardLayout role="student" title="Student Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="EPFL Course Tracking"
          description="View your progress and evaluations"
          action={{
            type: "link",
            href: "#course-progress",
            text: "View Progress",
          }}
        />
        <DashboardCard
          title="Project Submissions"
          description={
            overallProgress < 100
              ? "Complete all coursework to unlock project submission"
              : "Submit EPFL projects"
          }
          action={{
            type: "form",
            text: "Submit Project",
            disabled: overallProgress < 100,
            form: {
              title: "Submit EPFL Project",
              description: "Provide details about your project submission.",
              fields: [
                {
                  id: "project-name",
                  label: "Project Name",
                  type: "text",
                  placeholder: "Enter project name",
                  required: true,
                },
                {
                  id: "project-description",
                  label: "Project Description",
                  type: "textarea",
                  placeholder: "Describe your project...",
                  required: true,
                },
                {
                  id: "github-link",
                  label: "GitHub Link",
                  type: "text",
                  placeholder: "https://github.com/yourusername/project",
                  required: true,
                },
              ],
              onSubmit: (formData) => {
                console.log("Project submitted:", formData);
              },
            },
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>
              Upcoming workshops, events, and practice sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                  modifiers={{
                    event: (date) =>
                      mockCalendarEvents.some(
                        (event) =>
                          event.date.toDateString() === date.toDateString()
                      ),
                    selected: (date) =>
                      selectedDate?.toDateString() === date.toDateString(),
                  }}
                  modifiersStyles={{
                    event: { backgroundColor: "gray", fontWeight: "bold" },
                    selected: {
                      backgroundColor: "black",
                      color: "white",
                      fontWeight: "bold",
                    },
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">
                  Events for {selectedDate?.toDateString()}
                </h3>
                {selectedEvents.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedEvents.map((event, index) => (
                      <li key={index} className="border p-2 rounded">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-600">{event.time}</p>
                        <p className="text-sm text-gray-600">
                          {event.location}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No events scheduled for this day.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Matching</CardTitle>
            <CardDescription>
              Matched companies and interview schedules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable<Record<string, React.ReactNode> & CompanyMatch>
              columns={[
                { header: "Company", accessor: "companyName" },
                {
                  header: "Match",
                  accessor: (match) => (
                    <Badge variant="secondary">{match.matchPercentage}%</Badge>
                  ),
                },
                { header: "Interview Date", accessor: "interviewDate" },
                { header: "Interview Time", accessor: "interviewTime" },
              ]}
              data={
                mockCompanyMatches as (Record<string, React.ReactNode> &
                  CompanyMatch)[]
              }
            />
          </CardContent>
        </Card>
      </div>

      <Card id="course-progress">
        <CardHeader>
          <CardTitle>EPFL Course Progress</CardTitle>
          <CardDescription>
            Overview of your current course progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {overallProgress}%
                </span>
              </div>
              <Progress value={overallProgress} className="h-2" />
              <Button onClick={handleUpdateProgress} className="w-full mt-2">
                Update Daily Progress
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default StudentDashboard;
