
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { format } from "date-fns";

// Define mood values - updated to remove "calm"
const moodToValue = {
  "extremely-happy": 6,
  "happy": 5,
  "neutral": 4,
  "sad": 3,
  "very-sad": 2,
  "confused": 1,
  "overwhelmed": 0
};

// Define the custom tooltip
const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover text-popover-foreground p-2 rounded-md border shadow-sm">
        <p className="font-medium">{format(new Date(data.date), "MMM d")}</p>
        <p className="capitalize text-sm">{data.mood}</p>
      </div>
    );
  }

  return null;
};

// Define the color mapping for moods
const moodColors = {
  "extremely-happy": "#A7F3D0", // bright green
  "happy": "#BAE6FD", // light blue
  "neutral": "#FEF08A", // yellow
  "sad": "#FECACA", // light red
  "very-sad": "#F87171", // red
  "confused": "#C4B5FD", // purple
  "overwhelmed": "#FB923C" // orange
};

interface MoodDataPoint {
  date: string;
  value: number;
  mood: string;
}

interface MoodChartProps {
  data: MoodDataPoint[];
}

export default function MoodChart({ data }: MoodChartProps) {
  // Process the data to use the mood values
  const chartData = data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Mood Trends</CardTitle>
        <CardDescription>Your mood patterns over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), "MMM d")}
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => {
                  switch (value) {
                    case 6:
                      return "Extremely Happy";
                    case 5:
                      return "Happy";
                    case 4:
                      return "Neutral";
                    case 3:
                      return "Sad";
                    case 2:
                      return "Very Sad";
                    case 1:
                      return "Confused";
                    case 0:
                      return "Overwhelmed";
                    default:
                      return "";
                  }
                }}
                domain={[0, 6]}
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#9b87f5"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
