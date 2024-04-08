"use client";

import dayjs from "dayjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  month: number;
  total: number;
}

export default function ExpensesChart({
  expensesForYear,
}: {
  expensesForYear: ChartData[];
}) {
  const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
  const data = allMonths.map((month) => {
    const monthData = expensesForYear.find((data) => data.month == month);
    return {
      name: dayjs()
        .month(month - 1)
        .format("MMM"),
      total: monthData ? +monthData.total : 0,
    };
  });

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-8">
      <h3 className="font-bold mb-4">{`
        Expenses for ${dayjs().year()}
      `}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          width={500}
          height={200}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
          style={{
            width: "100%",
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            connectNulls
            type="monotone"
            dataKey="total"
            stroke="rgb(29 78 216 / 1)"
            fill="rgb(29 78 216 / 1)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
