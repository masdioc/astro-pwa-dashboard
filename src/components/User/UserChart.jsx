import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function UserChart({ userCount }) {
  const data = [
    { name: "Pengguna", jumlah: userCount },
    { name: "Sisa Slot", jumlah: 100 - userCount }, // misal batas 100
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="jumlah" fill="#3182ce" />
      </BarChart>
    </ResponsiveContainer>
  );
}
