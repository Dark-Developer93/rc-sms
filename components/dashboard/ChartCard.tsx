import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ChartCardProps {
  id?: string;
  title: string;
  description: string;
  data: Record<string, number | string>[];
  bars: {
    dataKey: string;
    fill: string;
    name: string;
    yAxisId?: string;
  }[];
  xAxisDataKey: string;
  height?: number;
}

export function ChartCard({
  id,
  title,
  description,
  data,
  bars,
  xAxisDataKey,
  height = 300,
}: ChartCardProps) {
  return (
    <Card id={id} className="mb-8">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisDataKey} />
            {bars.map((bar, index) => (
              <YAxis
                key={index}
                yAxisId={bar.yAxisId || "left"}
                orientation={bar.yAxisId === "right" ? "right" : "left"}
                stroke={bar.fill}
              />
            ))}
            <Tooltip />
            <Legend />
            {bars.map((bar, index) => (
              <Bar
                key={index}
                yAxisId={bar.yAxisId || "left"}
                dataKey={bar.dataKey}
                fill={bar.fill}
                name={bar.name}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
