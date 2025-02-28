import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { mockCompanies, mockStudents } from "@/mocks/dashboardData";

interface CompanyStudentMatchingProps {
  onMatch: (companyId: string, studentId: string) => void;
}

export function CompanyStudentMatching({
  onMatch,
}: CompanyStudentMatchingProps) {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");

  const handleSubmit = () => {
    if (selectedCompany && selectedStudent) {
      onMatch(selectedCompany, selectedStudent);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div>
        <Label htmlFor="company">Company</Label>
        <Select
          value={selectedCompany}
          onValueChange={(value) => setSelectedCompany(value)}
        >
          <SelectTrigger id="company">
            <SelectValue placeholder="Select company" />
          </SelectTrigger>
          <SelectContent>
            {mockCompanies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="student">Student</Label>
        <Select
          value={selectedStudent}
          onValueChange={(value) => setSelectedStudent(value)}
        >
          <SelectTrigger id="student">
            <SelectValue placeholder="Select student" />
          </SelectTrigger>
          <SelectContent>
            {mockStudents.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!selectedCompany || !selectedStudent}
        className="w-full"
      >
        Create Match
      </Button>
    </div>
  );
}
