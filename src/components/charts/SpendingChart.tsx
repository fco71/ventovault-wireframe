import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Food & Dining', value: 450, color: '#06b6d4' },
  { name: 'Shopping', value: 320, color: '#22d3ee' },
  { name: 'Transport', value: 180, color: '#67e8f9' },
  { name: 'Bills', value: 250, color: '#a5f3fc' },
  { name: 'Entertainment', value: 120, color: '#fdba74' },
];

const COLORS = data.map((item) => item.color);

export default function SpendingChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Breakdown</h3>

      <div className="h-64 min-h-[240px] min-w-0 relative">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                borderRadius: '12px',
                padding: '8px 12px',
                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.18)',
              }}
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700">{item.name}</span>
            </div>
            <span className="font-semibold text-gray-900">${item.value}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
