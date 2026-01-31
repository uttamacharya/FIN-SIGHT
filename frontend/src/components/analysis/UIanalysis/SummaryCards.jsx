const SummaryCards = ({ data }) => {
  if (!data) return null;

  const {
    total_income = 0,
    total_expense = 0,
    net_balance = 0
  } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* INCOME */}
      <div className="bg-green-100 p-4 rounded shadow">
        <p className="text-sm text-green-700">Total Income</p>
        <p className="text-xl font-semibold text-green-900">
          ₹ {total_income}
        </p>
      </div>

      {/* EXPENSE */}
      <div className="bg-red-100 p-4 rounded shadow">
        <p className="text-sm text-red-700">Total Expense</p>
        <p className="text-xl font-semibold text-red-900">
          ₹ {total_expense}
        </p>
      </div>

      {/* BALANCE */}
      <div
        className={`p-4 rounded shadow ${
          net_balance >= 0
            ? "bg-blue-100"
            : "bg-orange-100"
        }`}
      >
        <p className="text-sm text-blue-700">Net Balance</p>
        <p className="text-xl font-semibold text-blue-900">
          ₹ {net_balance}
        </p>
      </div>

    </div>
  );
};

export default SummaryCards;
