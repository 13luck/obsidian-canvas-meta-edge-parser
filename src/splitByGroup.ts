import { groupBy, prop } from 'rambda'

import { AllCanvasNodeData, CanvasData } from './canvas'
import { checkAABBCollision } from './checkAABBCollision'
import { convention } from './constants'


export const splitByGroup = (canvasData: CanvasData) => {
  const { group = [], text = [] } = groupBy<AllCanvasNodeData>(prop('type'))(canvasData.nodes)

  const groups = group.map((g) => {
    const related = text.filter(checkAABBCollision(g))

    const nodes = related.filter(convention.findNodes)
    const edges = related.filter(convention.findEdges)

    const edgeArtifact = edges
      .flatMap((node) => canvasData.edges
        .filter((edge) => node.id === edge.fromNode || edge.toNode === node.id))

    return {
      nodes: [...nodes, ...edges],
      edges: edgeArtifact,
      group: g.label,
    }
  })

  return groups as (CanvasData & { group: string })[]
}
