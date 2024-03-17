export default function ExpensesStats({
  data,
  type,
}: {
  data: {
    category: string;
    total: number;
  }[];
  type: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h3 className="font-bold">
        {type === "topThree" ? "Top Expenses" : "Recent Expenses"}
      </h3>
      <div className="flex flex-col gap-4 mt-4">
        {data.length > 0 ? (
          data.map((categoryData) => (
            <div
              key={categoryData.category}
              className="flex justify-between items-center"
            >
              <p className="text-xs text-gray-500">{categoryData.category}</p>
              <p className="text-xs font-bold text-gray-500">
                {`$${categoryData.total}`}
              </p>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500">
            {type === "topThree" ? "No expenses yet" : "No recent expenses"}
          </p>
        )}
      </div>
    </div>
  );
}
