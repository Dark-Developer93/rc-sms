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
import { Progress } from "@/components/ui/progress";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarEvent } from "@/types/dashboard";
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

  const handleSubmitProject = (): void => {
    console.log("Project submitted");
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
    <div>
      <Nav role="student" />
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>EPFL Course Tracking</CardTitle>
              <CardDescription>
                View your progress and evaluations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="#course-progress">View Progress</a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Project Submissions</CardTitle>
              <CardDescription>
                {overallProgress < 100
                  ? "Complete all coursework to unlock project submission"
                  : "Submit EPFL projects"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button disabled={overallProgress < 100}>
                    Submit Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit EPFL Project</DialogTitle>
                    <DialogDescription>
                      Provide details about your project submission.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        placeholder="Enter project name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-description">
                        Project Description
                      </Label>
                      <Textarea
                        id="project-description"
                        placeholder="Describe your project..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="github-link">GitHub Link</Label>
                      <Input
                        id="github-link"
                        placeholder="https://github.com/yourusername/project"
                      />
                    </div>
                    <Button type="button" onClick={handleSubmitProject}>
                      Submit Project
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
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
                      event: {
                        backgroundColor: "gray",
                        fontWeight: "bold",
                      },
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Match</TableHead>
                    <TableHead>Interview Date</TableHead>
                    <TableHead>Interview Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCompanyMatches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell>{match.companyName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {match.matchPercentage}%
                        </Badge>
                      </TableCell>
                      <TableCell>{match.interviewDate}</TableCell>
                      <TableCell>{match.interviewTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
      </main>
    </div>
  );
};

export default StudentDashboard;
