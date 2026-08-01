'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { parseISO, format, eachMonthOfInterval, startOfYear, endOfYear } from 'date-fns';

export function ScheduleDensity() {
  const bookings = useAppStore((s) => s.bookings);
  
  const data = useMemo(() => {
    const months = eachMonthOfInterval({
      start: startOfYear(new Date()),
      end: endOfYear(new Date()),
    });
    
    return months.map((month) => {
      const monthBookings = bookings.filter((b) => {
        const d = parseISO(b.date);
        return d.getMonth() === month.getMonth();
      });
      const hours = monthBookings.reduce((s, b) => s + b.hours, 0);
      const capacity = 160;
      
      return {
        month: format(month, 'MMM'),
        hours,
        load: Math.min((hours / capacity) * 100, 100),
        revenue: monthBookings.reduce((s, b) => s + b.revenue, 0),
      };
    });
  }, [bookings]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-zinc-100 font-semibold mb-6">Schedule Density</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="month" stroke="#52525b" fontSize={12} />
            <YAxis stroke="#52525b" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }}
              itemStyle={{ color: '#a1a1aa' }}
            />
            <Bar dataKey="load" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.load > 90 ? '#f43f5e' : entry.load > 75 ? '#fbbf24' : '#10b981'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Healthy</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Busy</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> At Risk</span>
      </div>
    </div>
  );
}