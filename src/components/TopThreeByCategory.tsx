export default function TopThreeByCategory({
  topThreeCategories,
}: {
  topThreeCategories: {
    category: string;
    total: number;
  }[];
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h3 className="font-bold">Top Expenses</h3>
      <div className="flex flex-col gap-4 mt-4">
        {topThreeCategories.length > 0 ? (
          topThreeCategories.map((categoryData) => (
            <div
              key={categoryData.category}
              className="flex justify-between items-center"
            >
              <p className="text-xs text-gray-500">{categoryData.category}</p>
              <p className="text-xs font-bold text-gray-500">
                {categoryData.total}
              </p>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500">No expenses yet</p>
        )}
      </div>
    </div>
  );
}
