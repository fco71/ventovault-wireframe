import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', sent: 120, received: 80 },
  { day: 'Tue', sent: 250, received: 150 },
  { day: 'Wed', sent: 180, received: 200 },
  { day: 'Thu', sent: 320, received: 100 },
  { day: 'Fri', sent: 200, received: 250 },
  { day: 'Sat', sent: 150, received: 180 },
  { day: 'Sun', sent: 100, received: 120 },
];

export default function ActivityChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary-600" />
            <span className="text-gray-600">Sent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success-500" />
            <span className="text-gray-600">Received</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="day"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                borderRadius: '12px',
                padding: '8px 12px',
                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.18)',
              }}
              formatter={(value: number) => `$${value}`}
            />
            <Bar
              dataKey="sent"
              fill="#06b6d4"
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            />
            <Bar
              dataKey="received"
              fill="#10b981"
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
