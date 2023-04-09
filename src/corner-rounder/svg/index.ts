import { Line, PathSegment, Position2D } from '../types'
import { ToSvgLinesAndArcsOptions } from './types'

const applyToSvgLinesAndArcsOptionsToSvgEl = (svgEl: SVGElement, options: ToSvgLinesAndArcsOptions): void => {
  if (options.color != null)
    svgEl.setAttribute('stroke', options.color)
  if (options.lineWidth != null)
    svgEl.setAttribute('stroke-width', options.lineWidth.toString())
  if (options.opacity != null)
    svgEl.setAttribute('opacity', options.opacity.toString())
}

const createSvgLineEl = (
  line: Line,
  options: ToSvgLinesAndArcsOptions | undefined | null,
): SVGLineElement => {
  const lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  lineEl.setAttribute('x1', line[0][0].toString())
  lineEl.setAttribute('y1', line[0][1].toString())
  lineEl.setAttribute('x2', line[1][0].toString())
  lineEl.setAttribute('y2', line[1][1].toString())
  if (options != null)
    applyToSvgLinesAndArcsOptionsToSvgEl(lineEl, options)
  return lineEl
}

const createArcPathStatement = (
  tgtPos: Position2D,
  sweepFlag: boolean,
  r: number,
) => `A ${r} ${r} 0 0 ${sweepFlag ? '1' : '0'} ${tgtPos[0]} ${tgtPos[1]}`

const createSvgArcEl = (
  srcPos: Position2D,
  tgtPos: Position2D,
  r: number,
  sweepFlag: boolean,
  options: ToSvgLinesAndArcsOptions | undefined | null,
): SVGPathElement => {
  const arcEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  arcEl.setAttribute('d', `M ${srcPos[0]} ${srcPos[1]} ${createArcPathStatement(tgtPos, sweepFlag, r)}`)
  arcEl.setAttribute('fill', 'none')
  if (options != null)
    applyToSvgLinesAndArcsOptionsToSvgEl(arcEl, options)
  return arcEl
}

export const toSvgLinesAndArcs = (
  pathSegments: PathSegment[],
  r: number,
  options: ToSvgLinesAndArcsOptions | undefined | null,
): (SVGLineElement | SVGPathElement)[] => {
  const els: (SVGLineElement | SVGPathElement)[] = []
  pathSegments.forEach((ps, i) => {
    els.push(createSvgLineEl(ps.line, options))
    if (ps.arc != null)
      els.push(createSvgArcEl(ps.line[1], pathSegments[i + 1].line[0], ps.arc.r ?? r, ps.arc.sweepFlag, options))
  })
  return els
}

export const toSvgPathDParameter = (
  pathSegments: PathSegment[],
  r: number,
) => {
  const firstPos = pathSegments[0].line[0]
  // Start the path at the beginning of the first line
  let d = `M ${firstPos[0]} ${firstPos[1]}`
  for (let i = 0; i < pathSegments.length; i += 1) {
    const ps = pathSegments[i]
    const endOfThisLinePos = ps.line[1]
    // Line to the end of the current line
    d += ` L ${endOfThisLinePos[0]} ${endOfThisLinePos[1]}`

    // Arc to the start of the next line
    if (ps.arc != null) {
      const startOfNextLinePos = pathSegments[i + 1].line[0]
      d += ` ${createArcPathStatement(startOfNextLinePos, ps.arc.sweepFlag, ps.arc.r ?? r)}`
    }
  }

  return d
}
