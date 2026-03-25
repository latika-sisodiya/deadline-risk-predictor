export default function RiskGauge({ risk }: { risk: string }) {
  const color =
    risk === "high"
      ? "text-red-400"
      : risk === "medium"
        ? "text-yellow-400"
        : "text-green-400";

  return (
    <div className="p-6 border rounded text-center">
      <h3>Risk</h3>
      <p className={`text-3xl ${color}`}>{risk}</p>
    </div>
  );
}
