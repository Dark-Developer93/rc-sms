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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FormField {
  id: string;
  label: string;
  type: "text" | "date" | "time" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string;
}

interface FormDialogProps {
  buttonText: string;
  title: string;
  description: string;
  fields: FormField[];
  onSubmit: (formData: Record<string, string>) => void;
  disabled?: boolean;
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

type Period = "AM" | "PM";

export function FormDialog({
  buttonText,
  buttonSize = "default",
  buttonVariant = "default",
  title,
  description,
  fields,
  disabled,
  onSubmit,
}: FormDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("AM");
  const [selectValues, setSelectValues] = useState<Record<string, string>>({});

  const handleDialogOpen = (isOpen: boolean) => {
    if (isOpen) {
      const initialSelectValues: Record<string, string> = {};
      fields.forEach((field) => {
        if (field.type === "select" && field.defaultValue) {
          initialSelectValues[field.id] = field.defaultValue;
        }
      });
      setSelectValues(initialSelectValues);

      fields.forEach((field) => {
        if (field.type === "time" && field.defaultValue) {
          const [time, period] = field.defaultValue.split(" ");
          const [hour, minute] = time.split(":");
          setSelectedHour(hour);
          setSelectedMinute(minute);
          setSelectedPeriod(period as Period);
        }
        if (field.type === "date" && field.defaultValue) {
          setSelectedDate(new Date(field.defaultValue));
        }
      });
    }
    setOpen(isOpen);
  };

  const renderTimeField = () => {
    return (
      <div className="flex space-x-2">
        <div className="flex-1">
          <Label>Hour</Label>
          <Select value={selectedHour} onValueChange={setSelectedHour}>
            <SelectTrigger>
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const hour = (i + 1).toString().padStart(2, "0");
                return (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label>Minute</Label>
          <Select value={selectedMinute} onValueChange={setSelectedMinute}>
            <SelectTrigger>
              <SelectValue placeholder="Minute" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 60 }, (_, i) => {
                const minute = i.toString().padStart(2, "0");
                return (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label>Period</Label>
          <Select
            value={selectedPeriod}
            onValueChange={(value) => setSelectedPeriod(value as Period)}
          >
            <SelectTrigger>
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  const renderDateField = (field: FormField) => {
    return (
      <div className="relative">
        <Input
          id={field.id}
          name={field.id}
          type="text"
          value={selectedDate ? format(selectedDate, "PPP") : ""}
          placeholder={field.placeholder}
          readOnly
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              size="sm"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} size={buttonSize} variant={buttonVariant}>
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data: Record<string, string> = {};

            fields.forEach((field) => {
              if (field.type === "date") {
                data[field.id] = selectedDate
                  ? format(selectedDate, "PPP")
                  : "";
              } else if (field.type === "time") {
                data[
                  field.id
                ] = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
              } else if (field.type === "select") {
                data[field.id] =
                  selectValues[field.id] || (formData.get(field.id) as string);
              } else {
                data[field.id] = formData.get(field.id) as string;
              }
            });

            onSubmit(data);
            setOpen(false);

            setSelectedDate(undefined);
            setSelectedHour("");
            setSelectedMinute("");
            setSelectedPeriod("AM");
            setSelectValues({});
          }}
        >
          {fields.map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.id}
                  name={field.id}
                  placeholder={field.placeholder}
                  required={field.required}
                  defaultValue={field.defaultValue}
                />
              ) : field.type === "select" ? (
                <Select
                  name={field.id}
                  required={field.required}
                  value={selectValues[field.id]}
                  onValueChange={(value) =>
                    setSelectValues((prev) => ({
                      ...prev,
                      [field.id]: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "date" ? (
                renderDateField(field)
              ) : field.type === "time" ? (
                renderTimeField()
              ) : (
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  defaultValue={field.defaultValue}
                />
              )}
            </div>
          ))}
          <Button type="submit">{buttonText}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
