export default function TotalForMonth({
  userName,
  totalForMonth,
}: {
  userName: string;
  totalForMonth: string;
}) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <div className="bg-[url('/monthly-total-bg.png')] bg-no-repeat bg-cover rounded-lg shadow-lg p-4">
      <h3 className="text-xs text-white">Hello, {userName}!</h3>
      <p className="text-xs font-bold mt-1 text-white">
        Here is your balance for {monthNames[new Date().getMonth()]}:
      </p>
      <p className="text-xl text-white font-bold mt-5">{totalForMonth}</p>
    </div>
  );
}
