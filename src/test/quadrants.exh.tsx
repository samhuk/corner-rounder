import React, { useEffect, useRef } from 'react'
import exhibit, { simpleNumberSliderModifier, simpleSelectModifier, simpleTextInputModifier } from 'exhibitor'
import { Route } from '../corner-rounder/types'
import { roundCorners } from '../corner-rounder'

const QUADRANT_ROUTES: Route[] = [
  // -- Clockwise
  [
    [0, 0],
    [50, 0],
    [50, 50],
  ],
  [
    [50, 0],
    [50, 50],
    [0, 50],
  ],
  [
    [50, 50],
    [0, 50],
    [0, 0],
  ],
  [
    [0, 50],
    [0, 0],
    [50, 0],
  ],
  // -- Anti-clockwise
  [
    [50, 50],
    [50, 0],
    [0, 0],
  ],
  [
    [0, 50],
    [50, 50],
    [50, 0],
  ],
  [
    [0, 0],
    [0, 50],
    [50, 50],
  ],
  [
    [50, 0],
    [0, 0],
    [0, 50],
  ],
]

const Component = (props: {
  radius: number
  routes: Route[]
  color: string
  lineWidth: number
  method: 'toSvgLineAndArcs' | 'toSvgPathDParameter'
}) => {
  const elRef = useRef<HTMLDivElement>()

  useEffect(() => {
    const el = elRef.current
    if (el == null)
      return undefined

    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

    svgEl.setAttribute('x', '0')
    svgEl.setAttribute('y', '0')
    svgEl.setAttribute('width', '700px')
    svgEl.setAttribute('height', '500px')

    const gridSpacing = 120
    const padding = 5

    props.routes.forEach((route, i) => {
      const extraX = ((i % 4) * gridSpacing) + padding
      const extraY = (Math.floor(i / 4) * gridSpacing) + padding
      const modifiedRoute: Route = route.map(pos => [pos[0] + extraX, pos[1] + extraY])
      if (props.method === 'toSvgLineAndArcs') {
        roundCorners({
          route: modifiedRoute,
          cornerArcRadius: props.radius,
        }).toSvgLineAndArcs({
          color: props.color,
          lineWidth: props.lineWidth,
        }).forEach(svgLineOrArc => svgEl.appendChild(svgLineOrArc))
      }
      else if (props.method === 'toSvgPathDParameter') {
        const pathDParameter = roundCorners({
          route: modifiedRoute,
          cornerArcRadius: props.radius,
        }).toSvgPathDParameter()
        const svgPathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        svgPathEl.setAttribute('d', pathDParameter)
        svgPathEl.setAttribute('stroke-width', props.lineWidth.toString())
        svgPathEl.setAttribute('stroke', props.color)
        svgPathEl.setAttribute('fill', 'none')
        svgEl.appendChild(svgPathEl)
      }
    })

    el.appendChild(svgEl)

    return () => {
      el.removeChild(svgEl)
    }
  }, [elRef.current, props])

  return (
    <div className="cl-quadrants" ref={elRef} />
  )
}

exhibit(Component, 'Quadrants')
  .defaults({
    radius: 10,
    routes: QUADRANT_ROUTES,
    color: 'white',
    lineWidth: 2,
    method: 'toSvgLineAndArcs',
  })
  .propModifiers([
    simpleNumberSliderModifier('radius', { min: 0, max: 100, step: 1 }),
    simpleNumberSliderModifier('lineWidth', { min: 1, max: 20, step: 1 }),
    simpleTextInputModifier('color'),
    simpleSelectModifier('method', ['toSvgLineAndArcs', 'toSvgPathDParameter']),
  ])
  .build()
