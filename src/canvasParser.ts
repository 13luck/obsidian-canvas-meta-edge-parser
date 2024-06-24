import { Graph } from 'graphlib'

import { CanvasData, CanvasEdgeData, CanvasTextData } from './canvas'
import { convention, NODE_COLOR } from './constants'
import { parseName } from './parseName'


export type ConventionNode = CanvasTextData & {
  nodeName: string
}
export type ConventionEdge = CanvasEdgeData & {
  edgeName: string
  fromNodeId: string
  toNodeId: string
}


/**
 Parser for obsidian canvas documents using the "meta-edge" convention
*/

export const canvasParser = (canvasData: CanvasData) => {
  const graph = new Graph({ directed: true, multigraph: true })

  const canvasNodes = canvasData.nodes
    .filter(convention.findNodes)
    .map((canvasNode) => {
      const nodeName = parseName((canvasNode as CanvasTextData)?.text ?? '')
      if (!nodeName) throw new Error('Bad node name')
      return { ...canvasNode, nodeName }
    })

  const canvasEdges = canvasData.nodes
    .filter(convention.findEdges)
    .flatMap((edge) => {
      const edgeName = parseName(edge.text)
      const fromNodes = canvasData.edges.filter(({ toNode }) => toNode === edge.id)
      const toNodes = canvasData.edges.filter(({ fromNode }) => fromNode === edge.id)

      if (fromNodes.length > 1 && toNodes.length > 1) throw new Error('Некорректно смоделировано состояние')

      // one-many -<
      if (fromNodes.length === 1) {
        const fromNode = fromNodes[0].fromNode
        const fromNodeColor = canvasNodes.find(({ id }) => id === fromNode)?.color

        if (fromNodeColor !== NODE_COLOR) throw new Error(`Forgot to color ${fromNode} or remove the connection`)

        return toNodes.map(({ toNode }) => {
          const toNodeColor = canvasNodes.find(({ id }) => id === toNode)?.color
          if (toNodeColor !== NODE_COLOR) throw new Error(`Forgot to color ${toNode} or remove the connection`)

          return { ...edge, edgeName, fromNodeId: fromNode, toNodeId: toNode }
        })
      }

      // many-one >-
      if (toNodes.length === 1) {
        const toNode = toNodes[0].toNode
        const toNodeColor = canvasNodes.find(({ id }) => id === toNode)?.color

        if (toNodeColor !== NODE_COLOR) throw new Error(`Forgot to color ${toNode} or remove the connection`)

        return fromNodes.map(({ fromNode }) => {
          const fromNodeColor = canvasNodes.find(({ id }) => id === fromNode)?.color
          if (fromNodeColor !== NODE_COLOR) throw new Error(`Forgot to color ${fromNode} or remove the connection`)

          return { ...edge, edgeName, fromNodeId: fromNode, toNodeId: toNode }
        })
      }

      return []
    }) as unknown as ConventionEdge[]

  canvasNodes.forEach((node) => graph.setNode(node.id, node))
  canvasEdges.forEach((edge) => {
    // unique graphlib identifier
    // otherwise everything will collapse (this is tested in `E` case)
    const uniqueName = `${edge.x}|${edge.y}`

    graph.setEdge(edge.fromNodeId, edge.toNodeId, edge, uniqueName)
  })

  const getNodes = (): ConventionNode[] => graph.nodes().map((nodeKey) => graph.node(nodeKey))
  const getEdges = (): ConventionEdge[] => graph.edges().map(({ v, w, name }) => graph.edge(v, w, name))

  return {
    graph,
    getNodes,
    getEdges,
  }
}
