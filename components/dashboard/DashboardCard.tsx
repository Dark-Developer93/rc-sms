import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormDialog } from "./FormDialog";

interface DashboardCardProps {
  title: string;
  description: string;
  action?: {
    type: "link" | "form";
    text: string;
    href?: string;
    disabled?: boolean;
    form?: {
      title: string;
      description: string;
      fields: {
        id: string;
        label: string;
        type: "text" | "date" | "time" | "textarea" | "select";
        placeholder?: string;
        required?: boolean;
        options?: string[];
      }[];
      onSubmit: (formData: Record<string, string>) => void;
    };
  };
  children?: React.ReactNode;
}

export function DashboardCard({
  title,
  description,
  action,
  children,
}: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {action?.type === "link" && action.href && (
          <Button asChild>
            <a href={action.href}>{action.text}</a>
          </Button>
        )}
        {action?.type === "form" && action.form && (
          <FormDialog
            buttonText={action.text}
            title={action.form.title}
            description={action.form.description}
            fields={action.form.fields}
            onSubmit={action.form.onSubmit}
            disabled={action.disabled}
          />
        )}
        {!action && children}
      </CardContent>
    </Card>
  );
}
