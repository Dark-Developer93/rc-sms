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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ProjectEvaluation, WeeklyEvaluation } from "@/types/dashboard";
import {
  mockEvaluations,
  mockGroupProgress,
  mockWeeklyEvaluations,
} from "@/mocks/dashboardData";

export default function MentorDashboard() {
  const [evaluations, setEvaluations] =
    useState<ProjectEvaluation[]>(mockEvaluations);
  const [weeklyEvaluations, setWeeklyEvaluations] = useState<
    WeeklyEvaluation[]
  >(mockWeeklyEvaluations);

  const handleSubmitEvaluation = (
    id: number,
    evaluationStatus: "passed" | "failed"
  ): void => {
    setEvaluations(
      evaluations.map((projectEvaluation) =>
        projectEvaluation.id === id
          ? { ...projectEvaluation, status: "Completed", evaluationStatus }
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
              weeklyProgress,
              notes,
              lastUpdated,
            }
          : weeklyEvaluation
      )
    );
  };

  return (
    <div>
      <Nav role="mentor" />
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6">Mentor Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Group Tracking</CardTitle>
              <CardDescription>
                View EPFL course progress of assigned students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="#group-progress">View Group Progress</a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Assigned Evaluations</CardTitle>
              <CardDescription>
                View and submit evaluations for assigned students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="#evaluations">Manage Evaluations</a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance Evaluations</CardTitle>
              <CardDescription>
                Evaluate each member in your assigned group
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="#weekly-evaluations">Perform Evaluations</a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Schedule Group Standup</CardTitle>
              <CardDescription>
                Schedule a standup meeting for your assigned group
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Schedule Standup</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule Group Standup</DialogTitle>
                    <DialogDescription>
                      Set the date and time for your group&apos;s standup
                      meeting.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="standup-date">Date</Label>
                      <Input id="standup-date" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="standup-time">Time</Label>
                      <Input id="standup-time" type="time" />
                    </div>
                    <div>
                      <Label htmlFor="standup-location">Location</Label>
                      <Input
                        id="standup-location"
                        placeholder="Enter location or meeting link"
                      />
                    </div>
                    <Button type="submit">Schedule Standup</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Evaluation</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>{evaluation.studentName}</TableCell>
                    <TableCell>{evaluation.projectName}</TableCell>
                    <TableCell>{evaluation.dueDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          evaluation.status === "Completed"
                            ? "default"
                            : evaluation.status === "In Progress"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {evaluation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {evaluation.status === "Completed" && (
                        <Badge
                          variant={
                            evaluation.evaluationStatus === "passed"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {evaluation.evaluationStatus}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            {evaluation.status === "Completed"
                              ? "View"
                              : "Evaluate"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {evaluation.status === "Completed"
                                ? "Evaluation Details"
                                : "Submit Evaluation"}
                            </DialogTitle>
                            <DialogDescription>
                              {evaluation.status === "Completed"
                                ? "Review the submitted evaluation."
                                : "Provide feedback for the student's project."}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="technical-skills">
                                Technical Skills
                              </Label>
                              <Select defaultValue="4">
                                <SelectTrigger id="technical-skills">
                                  <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 - Poor</SelectItem>
                                  <SelectItem value="2">2 - Fair</SelectItem>
                                  <SelectItem value="3">3 - Good</SelectItem>
                                  <SelectItem value="4">
                                    4 - Very Good
                                  </SelectItem>
                                  <SelectItem value="5">
                                    5 - Excellent
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="problem-solving">
                                Problem Solving
                              </Label>
                              <Select defaultValue="3">
                                <SelectTrigger id="problem-solving">
                                  <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 - Poor</SelectItem>
                                  <SelectItem value="2">2 - Fair</SelectItem>
                                  <SelectItem value="3">3 - Good</SelectItem>
                                  <SelectItem value="4">
                                    4 - Very Good
                                  </SelectItem>
                                  <SelectItem value="5">
                                    5 - Excellent
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="communication">
                                Communication
                              </Label>
                              <Select defaultValue="4">
                                <SelectTrigger id="communication">
                                  <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 - Poor</SelectItem>
                                  <SelectItem value="2">2 - Fair</SelectItem>
                                  <SelectItem value="3">3 - Good</SelectItem>
                                  <SelectItem value="4">
                                    4 - Very Good
                                  </SelectItem>
                                  <SelectItem value="5">
                                    5 - Excellent
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="evaluation-status">
                                Evaluation Status
                              </Label>
                              <Select>
                                <SelectTrigger id="evaluation-status">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="passed">Passed</SelectItem>
                                  <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="feedback">
                                Detailed Feedback
                              </Label>
                              <Textarea
                                id="feedback"
                                placeholder="Enter your feedback here..."
                                rows={5}
                                defaultValue={
                                  evaluation.status === "Completed"
                                    ? "Great work on implementing the core features. Consider optimizing the algorithm for better performance."
                                    : ""
                                }
                                readOnly={evaluation.status === "Completed"}
                              />
                            </div>
                            {evaluation.status !== "Completed" && (
                              <Button
                                onClick={() =>
                                  handleSubmitEvaluation(
                                    evaluation.id,
                                    "passed"
                                  )
                                }
                              >
                                Submit Evaluation
                              </Button>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card id="weekly-evaluations">
          <CardHeader>
            <CardTitle>Weekly Performance Evaluations</CardTitle>
            <CardDescription>
              Evaluate the technical skills and weekly progress of your assigned
              group
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Technical Skills</TableHead>
                  <TableHead>Weekly Progress</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeklyEvaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>{evaluation.studentName}</TableCell>
                    <TableCell>{evaluation.technicalSkills}/5</TableCell>
                    <TableCell>{evaluation.weeklyProgress}/5</TableCell>
                    <TableCell>{evaluation.notes}</TableCell>
                    <TableCell>
                      {evaluation.lastUpdated?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Update Evaluation
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Weekly Evaluation</DialogTitle>
                            <DialogDescription>
                              Update the weekly evaluation for{" "}
                              {evaluation.studentName}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="technical-skills">
                                Technical Skills
                              </Label>
                              <Select
                                defaultValue={evaluation.technicalSkills.toString()}
                              >
                                <SelectTrigger id="technical-skills">
                                  <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 - Poor</SelectItem>
                                  <SelectItem value="2">2 - Fair</SelectItem>
                                  <SelectItem value="3">3 - Good</SelectItem>
                                  <SelectItem value="4">
                                    4 - Very Good
                                  </SelectItem>
                                  <SelectItem value="5">
                                    5 - Excellent
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="weekly-progress">
                                Weekly Progress
                              </Label>
                              <Select
                                defaultValue={evaluation.weeklyProgress.toString()}
                              >
                                <SelectTrigger id="weekly-progress">
                                  <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 - Poor</SelectItem>
                                  <SelectItem value="2">2 - Fair</SelectItem>
                                  <SelectItem value="3">3 - Good</SelectItem>
                                  <SelectItem value="4">
                                    4 - Very Good
                                  </SelectItem>
                                  <SelectItem value="5">
                                    5 - Excellent
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="notes">Notes</Label>
                              <Textarea
                                id="notes"
                                placeholder="Enter your notes here..."
                              />
                            </div>
                            <Button
                              onClick={() =>
                                handleSubmitWeeklyEvaluation(
                                  evaluation.id,
                                  evaluation.technicalSkills,
                                  evaluation.weeklyProgress,
                                  evaluation.notes || "",
                                  evaluation.lastUpdated || new Date()
                                )
                              }
                            >
                              Submit Evaluation
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
