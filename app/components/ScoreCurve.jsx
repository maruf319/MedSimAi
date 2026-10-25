// Glowing score curve for hero cards: numbered % axis, a value on each point,
// and a bead on the highest one. Pure SVG, safe in Server Components.

function spline(points) {
    let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i], p1 = points[i], p2 = points[i + 1], p3 = points[i + 2] || p2
        d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
    }
    return d
}

const shorten = (label) => (label.length > 16 ? `${label.slice(0, 15).trimEnd()}…` : label)

export default function ScoreCurve({ id = 'curve', labels, values }) {
    if (!values.length) return null
    const W = 600, H = 250, L = 52, R = 20, top = 26, bot = 204
    const lo = Math.max(0, Math.floor((Math.min(...values) - 5) / 10) * 10)
    const hi = Math.min(100, Math.ceil((Math.max(...values) + 5) / 10) * 10)
    const n = values.length
    const X = (i) => n === 1 ? (L + W - R) / 2 : L + 24 + (i * (W - L - R - 48)) / (n - 1)
    const Y = (v) => top + ((hi - v) / Math.max(1, hi - lo)) * (bot - top)
    const P = values.map((v, i) => [X(i), Y(v)])
    const d = spline([[L, P[0][1]], ...P, [W + 32, P[n - 1][1]]])
    const peak = values.indexOf(Math.max(...values))
    const ticks = Array.from({ length: (hi - lo) / 10 + 1 }, (_, k) => lo + k * 10)
    const small = n > 6

    return (
        <svg
            viewBox={`0 0 ${W + 32} ${H}`}
            role='img'
            aria-label={labels.map((l, i) => `${l} ${values[i]}%`).join(', ')}
            className='-mr-6 block h-auto w-[calc(100%+24px)] max-w-none sm:-mr-8 sm:w-[calc(100%+32px)]'
        >
            <defs>
                <linearGradient id={`${id}-line`} gradientUnits='userSpaceOnUse' x1={L} y1='0' x2={W} y2='0'>
                    <stop offset='0' stopColor='#9FC4C7' stopOpacity='.12' />
                    <stop offset='.35' stopColor='#C8E2E0' stopOpacity='.85' />
                    <stop offset='1' stopColor='#FFFFFF' />
                </linearGradient>
                <radialGradient id={`${id}-bead`} cx='.35' cy='.32' r='.75'>
                    <stop offset='0' stopColor='#FFFFFF' />
                    <stop offset='.55' stopColor='#DDEEEC' />
                    <stop offset='1' stopColor='#7FAAAE' />
                </radialGradient>
                <filter id={`${id}-glow`} x='-10%' y='-60%' width='120%' height='220%'>
                    <feGaussianBlur stdDeviation='5' />
                </filter>
            </defs>
            {ticks.map((t) =>
                <g key={t}>
                    <line x1={L} x2={W - R} y1={Y(t)} y2={Y(t)} stroke='var(--on-hero-line)' strokeDasharray={t === lo ? undefined : '3 6'} />
                    <text x={L - 12} y={Y(t) + 4} textAnchor='end' fontSize='12' fill='var(--on-hero-2)'>{t}%</text>
                </g>)}
            <path d={d} fill='none' stroke={`url(#${id}-line)`} strokeWidth='8' strokeOpacity='.22' filter={`url(#${id}-glow)`} />
            <path d={d} fill='none' stroke={`url(#${id}-line)`} strokeWidth='2.6' strokeLinecap='round' />
            {P.map(([x, y], i) => i === peak
                ? <circle key={i} cx={x} cy={y} r='7' fill={`url(#${id}-bead)`} />
                : <circle key={i} cx={x} cy={y} r='3.5' fill='#1A2729' stroke='var(--on-hero)' strokeWidth='1.6' />)}
            {P.map(([x, y], i) =>
                <text key={i} x={x} y={y - (i === peak ? 16 : 12)} textAnchor='middle' fontSize={i === peak ? 14 : 12.5} fontWeight='700' fill='var(--on-hero)' style={{ fontFamily: 'var(--font-display)' }}>
                    {values[i]}%
                </text>)}
            {labels.map((label, i) =>
                <text key={i} x={X(i)} y={H - 16} textAnchor='middle' fontSize={small ? 10.5 : 12} fill='var(--on-hero-2)'>
                    <title>{label}</title>{shorten(label)}
                </text>)}
        </svg>
    )
}
