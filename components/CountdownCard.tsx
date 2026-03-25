export default function CountdownCard({ deadline }: { deadline: string }) {
  const diff = new Date(deadline).getTime() - Date.now();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  return <div className="p-4 border rounded">Hours left: {hours}</div>;
}
