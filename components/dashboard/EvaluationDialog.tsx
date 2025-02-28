import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EvaluationStatus } from "@/types/dashboard";

interface EvaluationDialogProps {
  studentName: string;
  type: "project" | "weekly";
  onSubmit: (data: {
    evaluationStatus?: EvaluationStatus;
    technicalSkills: number;
    softSkills: number;
    overallScore: number;
    weeklyProgress?: number;
    feedback: string;
  }) => void;
  defaultValues?: {
    technicalSkills?: number;
    softSkills?: number;
    overallScore?: number;
    weeklyProgress?: number;
    feedback?: string;
    evaluationStatus?: EvaluationStatus;
  };
}

export function EvaluationDialog({
  studentName,
  type,
  onSubmit,
  defaultValues,
}: EvaluationDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {type === "weekly" ? "Update Evaluation" : "Evaluate"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "weekly"
              ? "Update Weekly Evaluation"
              : "Project Evaluation"}
          </DialogTitle>
          <DialogDescription>
            {type === "weekly"
              ? `Update the weekly evaluation for ${studentName}`
              : `Evaluate ${studentName}'s project submission`}
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSubmit({
              technicalSkills: Number(formData.get("technical-skills")),
              softSkills: Number(formData.get("soft-skills")),
              overallScore: Number(formData.get("overall-score")),
              evaluationStatus: formData.get("status") as
                | EvaluationStatus
                | undefined,
              feedback: formData.get("feedback") as string,
              weeklyProgress:
                type === "weekly"
                  ? Number(formData.get("weekly-progress"))
                  : undefined,
            });
            setOpen(false);
          }}
        >
          <div>
            <Label htmlFor="technical-skills">Technical Skills</Label>
            <Select
              name="technical-skills"
              defaultValue={defaultValues?.technicalSkills?.toString()}
            >
              <SelectTrigger id="technical-skills">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value} -{" "}
                    {value === 1
                      ? "Poor"
                      : value === 5
                      ? "Excellent"
                      : ["Fair", "Good", "Very Good"][value - 2]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="soft-skills">Soft Skills</Label>
            <Select
              name="soft-skills"
              defaultValue={defaultValues?.softSkills?.toString()}
            >
              <SelectTrigger id="soft-skills">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value} -{" "}
                    {value === 1
                      ? "Poor"
                      : value === 5
                      ? "Excellent"
                      : ["Fair", "Good", "Very Good"][value - 2]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="overall-score">Overall Score</Label>
            <Select
              name="overall-score"
              defaultValue={defaultValues?.overallScore?.toString()}
            >
              <SelectTrigger id="overall-score">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value} -{" "}
                    {value === 1
                      ? "Poor"
                      : value === 5
                      ? "Excellent"
                      : ["Fair", "Good", "Very Good"][value - 2]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {type === "project" && (
            <div>
              <Label htmlFor="status">Evaluation Status</Label>
              <Select name="status">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {type === "weekly" && (
            <div>
              <Label htmlFor="weekly-progress">Weekly Progress</Label>
              <Select
                name="weekly-progress"
                defaultValue={defaultValues?.weeklyProgress?.toString()}
              >
                <SelectTrigger id="weekly-progress">
                  <SelectValue placeholder="Select progress" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value} -{" "}
                      {value === 1
                        ? "Poor"
                        : value === 5
                        ? "Excellent"
                        : ["Fair", "Good", "Very Good"][value - 2]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="feedback">
              {type === "weekly" ? "Notes" : "Detailed Feedback"}
            </Label>
            <Textarea
              id="feedback"
              name="feedback"
              defaultValue={defaultValues?.feedback}
              placeholder="Enter your feedback here..."
            />
          </div>
          <Button type="submit">Submit Evaluation</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
