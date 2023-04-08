import React, { useEffect, useRef } from 'react'
import exhibit, { simpleNumberSliderModifier } from 'exhibitor'
import { Route } from '../corner-rounder/types'
import { roundCorners } from '../corner-rounder'

const Component = (props: {
  radius: number
  routes: Route[]
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
      roundCorners({
        route: modifiedRoute,
        cornerArcRadius: props.radius,
      }).toSvg().forEach(pathSvgEl => svgEl.appendChild(pathSvgEl))
    })

    el.appendChild(svgEl)

    return () => {
      el.removeChild(svgEl)
    }
  }, [elRef.current, props.radius, props.routes])

  return (
    <div className="cl-quadrants" ref={elRef} />
  )
}

exhibit(Component, 'Quadrants')
  .defaults({
    radius: 10,
    routes: [
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
    ],
  })
  .propModifiers([
    simpleNumberSliderModifier('radius', { min: 0, max: 100, step: 1 }),
  ])
  .build()
