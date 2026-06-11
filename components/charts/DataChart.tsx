'use client'

import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, PieChart, Pie, Cell,
} from 'recharts'
import type { ChartDataPoint, ChartType } from '@/types'

interface DataChartProps {
  data: ChartDataPoint[]
  type?: ChartType
  isCritical?: boolean
  title?: string
  height?: number
}

const NAVY    = '#0f2044'
const NAVY2   = '#1e4080'
const TEAL    = '#0d9488'
const AMBER   = '#d97706'
const CRIMSON = '#991b1b'
const VIOLET  = '#7c3aed'
const GRAY    = '#94a3b8'

const PALETTE = [NAVY, TEAL, AMBER, CRIMSON, VIOLET, NAVY2, '#059669', '#dc2626']

function fmtAxis(v: number): string {
  if (v === 0) return '0'
  const a = Math.abs(v)
  if (a < 0.0001) return v.toExponential(1)
  if (a < 0.01)   return v.toFixed(5)
  if (a < 1)      return v.toFixed(3)
  if (a >= 1e9)   return `${(v/1e9).toFixed(1)}B`
  if (a >= 1e6)   return `${(v/1e6).toFixed(1)}M`
  if (a >= 1e3)   return `${(v/1e3).toFixed(1)}K`
  return String(Number(v.toFixed(2)))
}

function fmtTooltip(v: number): string {
  const a = Math.abs(v)
  if (a < 0.0001) return v.toExponential(4)
  if (a < 0.01)   return v.toFixed(7)
  if (a >= 1e6)   return `${(v/1e6).toFixed(2)}M`
  if (a >= 1e3)   return `${(v/1e3).toFixed(2)}K`
  return String(v)
}

function isMultiCategory(data: ChartDataPoint[]): boolean {
  return data.some(d => d.category !== undefined)
}

function flattenMulti(data: ChartDataPoint[]) {
  const cats = Array.from(new Set(data.map(d => d.category || 'default')))
const labels = Array.from(new Set(data.map(d => d.label)))
  return {
    flat: labels.map(label => {
      const row: Record<string, string | number> = { label }
      cats.forEach(cat => {
        const match = data.find(d => d.label === label && (d.category || 'default') === cat)
        if (match) row[cat] = match.value
      })
      return row
    }),
    cats,
  }
}

const tooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  fontSize: '12px',
}

const axisProps = {
  tick: { fontSize: 11, fill: GRAY },
  axisLine: false as const,
  tickLine: false as const,
}

export default function DataChart({ data, type = 'line', isCritical = false, title, height = 240 }: DataChartProps) {
  if (!data || data.length === 0) return null

  const primary = isCritical ? CRIMSON : NAVY
  const common = { margin: { top: 8, right: 8, left: 0, bottom: 8 } }

  // --- DONUT ---
  if (type === 'donut') {
    const donutData = data.map(d => ({ name: d.label, value: d.value }))
    const total = donutData.reduce((s, d) => s + d.value, 0)
    return (
      <div className="w-full">
        {title && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</p>}
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="75%"
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              labelLine={false}
            >
              {donutData.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(val: number) => [fmtTooltip(val), '']}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
              formatter={(value) => <span style={{ color: '#374151' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // --- MULTI-CATEGORY GROUPED BAR ---
  if (isMultiCategory(data)) {
    const { flat, cats } = flattenMulti(data)
    const chartType = (type === 'bar' || type === 'bar_horizontal') ? type : 'bar'
    return (
      <div className="w-full">
        {title && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</p>}
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={flat}
            layout={chartType === 'bar_horizontal' ? 'vertical' : 'horizontal'}
            {...common}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            {chartType === 'bar_horizontal' ? (
              <>
                <XAxis type="number" {...axisProps} tickFormatter={fmtAxis} width={60} />
                <YAxis type="category" dataKey="label" {...axisProps} width={90} tick={{ fontSize: 10, fill: GRAY }} />
              </>
            ) : (
              <>
                <XAxis dataKey="label" {...axisProps} angle={-20} textAnchor="end" height={40} tick={{ fontSize: 10, fill: GRAY }} />
                <YAxis {...axisProps} tickFormatter={fmtAxis} width={60} />
              </>
            )}
            <Tooltip contentStyle={tooltipStyle} formatter={(val: number) => [fmtTooltip(val), '']} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            {cats.map((cat, i) => (
              <Bar key={cat} dataKey={cat} fill={PALETTE[i % PALETTE.length]} radius={[3, 3, 0, 0]} name={cat.replace(/_/g, ' ')} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // --- SINGLE SERIES ---
  return (
    <div className="w-full">
      {title && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</p>}
      <ResponsiveContainer width="100%" height={height}>
        {type === 'area' ? (
          <AreaChart data={data} {...common}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primary} stopOpacity={0.15} />
                <stop offset="95%" stopColor={primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={fmtAxis} width={60} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmtTooltip(v), 'Value']} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Area type="monotone" dataKey="value" stroke={primary} strokeWidth={2} fill="url(#areaGrad)" name="Value" />
            {data.some(d => d.secondary !== undefined) && (
              <Area type="monotone" dataKey="secondary" stroke={NAVY2} strokeWidth={2} fill="none" strokeDasharray="4 4" name="Secondary" />
            )}
          </AreaChart>
        ) : type === 'bar' ? (
          <BarChart data={data} {...common}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={fmtAxis} width={60} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmtTooltip(v), 'Value']} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="value" fill={primary} radius={[4, 4, 0, 0]} name="Value" />
          </BarChart>
        ) : type === 'bar_horizontal' ? (
          <BarChart data={data} layout="vertical" {...common}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis type="number" {...axisProps} tickFormatter={fmtAxis} width={60} />
            <YAxis type="category" dataKey="label" {...axisProps} width={90} tick={{ fontSize: 10, fill: GRAY }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmtTooltip(v), 'Value']} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="value" fill={primary} radius={[0, 4, 4, 0]} name="Value" />
          </BarChart>
        ) : (
          <LineChart data={data} {...common}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={fmtAxis} width={60} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmtTooltip(v), 'Value']} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="value" stroke={primary} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Value" />
            {data.some(d => d.secondary !== undefined) && (
              <Line type="monotone" dataKey="secondary" stroke={NAVY2} strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" name="Secondary" />
            )}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
