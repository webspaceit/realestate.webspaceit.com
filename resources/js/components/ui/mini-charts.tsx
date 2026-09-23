/**
 * Lightweight inline SVG charts — zero external dependencies.
 * Replaces recharts to avoid Vite 8 / Rolldown resolution issues.
 */

interface BarData  { label: string; value: number; value2?: number; color?: string; color2?: string }
interface AreaData { label: string; value: number }
interface PieData  { label: string; value: number; color: string }

// ── Shared helpers ────────────────────────────────────────────────────────────
function fmt(n: number, prefix = '') {
    if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000)     return `${prefix}${(n / 1_000).toFixed(0)}k`
    return `${prefix}${n}`
}

// ── Bar Chart ─────────────────────────────────────────────────────────────────
export function BarChartSvg({
    data, height = 200, prefix = '', color = '#6366f1', color2,
    label2,
}: {
    data: BarData[]
    height?: number
    prefix?: string
    color?: string
    color2?: string
    label2?: string
}) {
    if (!data.length) return <Empty />
    const pad = { top: 16, right: 8, bottom: 36, left: 44 }
    const W = 500
    const H = height
    const innerW = W - pad.left - pad.right
    const innerH = H - pad.top - pad.bottom
    const maxVal = Math.max(...data.flatMap(d => [d.value, d.value2 ?? 0])) * 1.1 || 1
    const barW = color2
        ? (innerW / data.length) * 0.35
        : (innerW / data.length) * 0.55
    const gap   = innerW / data.length

    const yTicks = 4
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
            {/* y-axis gridlines + labels */}
            {Array.from({ length: yTicks + 1 }).map((_, i) => {
                const yVal = (maxVal / yTicks) * i
                const y = pad.top + innerH - (innerH * i / yTicks)
                return (
                    <g key={i}>
                        <line x1={pad.left} x2={pad.left + innerW} y1={y} y2={y}
                            stroke="#f0f0f0" strokeWidth={1} />
                        <text x={pad.left - 6} y={y + 4} textAnchor="end"
                            fontSize={10} fill="#94a3b8">{fmt(yVal, prefix)}</text>
                    </g>
                )
            })}

            {/* bars */}
            {data.map((d, i) => {
                const x = pad.left + i * gap + gap / 2
                const barH  = (d.value  / maxVal) * innerH
                const barH2 = ((d.value2 ?? 0) / maxVal) * innerH
                const c1 = d.color  ?? color
                const c2 = d.color2 ?? color2 ?? '#14b8a6'
                return (
                    <g key={i}>
                        {color2 && (
                            <rect
                                x={x - barW - 2}
                                y={pad.top + innerH - barH}
                                width={barW} height={barH}
                                rx={3} fill={c1} opacity={0.9}
                            >
                                <title>{d.label}: {prefix}{d.value.toLocaleString()}</title>
                            </rect>
                        )}
                        {!color2 && (
                            <rect
                                x={x - barW / 2}
                                y={pad.top + innerH - barH}
                                width={barW} height={barH}
                                rx={3} fill={c1} opacity={0.9}
                            >
                                <title>{d.label}: {prefix}{d.value.toLocaleString()}</title>
                            </rect>
                        )}
                        {color2 && (
                            <rect
                                x={x + 2}
                                y={pad.top + innerH - barH2}
                                width={barW} height={barH2}
                                rx={3} fill={c2} opacity={0.9}
                            >
                                <title>{d.label} (weighted): {prefix}{(d.value2 ?? 0).toLocaleString()}</title>
                            </rect>
                        )}
                        {/* x label */}
                        <text x={x} y={H - 6} textAnchor="middle"
                            fontSize={9} fill="#94a3b8"
                            transform={`rotate(-20, ${x}, ${H - 6})`}>
                            {d.label.length > 10 ? d.label.slice(0, 9) + '…' : d.label}
                        </text>
                    </g>
                )
            })}

            {/* legend */}
            {color2 && label2 && (
                <g>
                    <rect x={pad.left} y={4} width={10} height={10} rx={2} fill={color} />
                    <text x={pad.left + 14} y={13} fontSize={10} fill="#64748b">Value</text>
                    <rect x={pad.left + 60} y={4} width={10} height={10} rx={2} fill={color2} />
                    <text x={pad.left + 74} y={13} fontSize={10} fill="#64748b">{label2}</text>
                </g>
            )}
        </svg>
    )
}

// ── Area / Line Chart ─────────────────────────────────────────────────────────
export function AreaChartSvg({
    data, height = 180, prefix = '', color = '#6366f1',
}: {
    data: AreaData[]
    height?: number
    prefix?: string
    color?: string
}) {
    if (!data.length) return <Empty />
    const pad = { top: 16, right: 12, bottom: 36, left: 44 }
    const W = 500
    const H = height
    const innerW = W - pad.left - pad.right
    const innerH = H - pad.top - pad.bottom
    const maxVal = Math.max(...data.map(d => d.value)) * 1.1 || 1
    const step   = innerW / (data.length - 1 || 1)

    const points = data.map((d, i) => ({
        x: pad.left + i * step,
        y: pad.top + innerH - (d.value / maxVal) * innerH,
        label: d.label,
        value: d.value,
    }))

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
    const areaPath = linePath
        + ` L${points[points.length - 1].x},${pad.top + innerH}`
        + ` L${points[0].x},${pad.top + innerH} Z`

    const yTicks = 4
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
            <defs>
                <linearGradient id={`ag-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={color} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>

            {Array.from({ length: yTicks + 1 }).map((_, i) => {
                const yVal = (maxVal / yTicks) * i
                const y = pad.top + innerH - (innerH * i / yTicks)
                return (
                    <g key={i}>
                        <line x1={pad.left} x2={pad.left + innerW} y1={y} y2={y}
                            stroke="#f0f0f0" strokeWidth={1} />
                        <text x={pad.left - 6} y={y + 4} textAnchor="end"
                            fontSize={10} fill="#94a3b8">{fmt(yVal, prefix)}</text>
                    </g>
                )
            })}

            <path d={areaPath} fill={`url(#ag-${color.replace('#', '')})`} />
            <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

            {points.map((p, i) => (
                <g key={i}>
                    <circle cx={p.x} cy={p.y} r={3} fill={color} />
                    <title>{p.label}: {prefix}{p.value.toLocaleString()}</title>
                    <text x={p.x} y={H - 4} textAnchor="middle" fontSize={9} fill="#94a3b8"
                        transform={`rotate(-25, ${p.x}, ${H - 4})`}>
                        {p.label}
                    </text>
                </g>
            ))}
        </svg>
    )
}

// ── Donut / Pie Chart ─────────────────────────────────────────────────────────
export function DonutChartSvg({
    data, size = 180,
}: {
    data: PieData[]
    size?: number
}) {
    if (!data.length) return <Empty />
    const total = data.reduce((s, d) => s + d.value, 0) || 1
    const cx = size / 2, cy = size / 2
    const outerR = size * 0.38, innerR = size * 0.22

    let cumAngle = -Math.PI / 2
    const slices = data.map(d => {
        const angle = (d.value / total) * 2 * Math.PI
        const start = cumAngle
        cumAngle += angle
        return { ...d, start, angle }
    })

    function arcPath(start: number, angle: number, r: number, ir: number) {
        const end = start + angle - 0.01
        const x1 = cx + r * Math.cos(start),  y1 = cy + r * Math.sin(start)
        const x2 = cx + r * Math.cos(end),    y2 = cy + r * Math.sin(end)
        const ix1 = cx + ir * Math.cos(end),  iy1 = cy + ir * Math.sin(end)
        const ix2 = cx + ir * Math.cos(start), iy2 = cy + ir * Math.sin(start)
        const large = angle > Math.PI ? 1 : 0
        return `M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${ix1},${iy1} A${ir},${ir} 0 ${large},0 ${ix2},${iy2} Z`
    }

    return (
        <div className="flex items-center gap-4">
            <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size, flexShrink: 0 }}>
                {slices.map((s, i) => (
                    <path key={i} d={arcPath(s.start, s.angle, outerR, innerR)}
                        fill={s.color} opacity={0.9}>
                        <title>{s.label}: {s.value}</title>
                    </path>
                ))}
                <text x={cx} y={cy + 4} textAnchor="middle" fontSize={13} fontWeight="bold" fill="#374151">
                    {total}
                </text>
            </svg>
            <div className="space-y-1.5 min-w-0">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="inline-block h-2.5 w-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                        <span className="text-muted-foreground truncate">{d.label}</span>
                        <span className="font-semibold ml-auto pl-2">{d.value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function Empty() {
    return <p className="py-10 text-center text-sm text-muted-foreground">No data yet.</p>
}
