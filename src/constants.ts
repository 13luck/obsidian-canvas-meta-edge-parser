import { AllCanvasNodeData } from './canvas'


export const NODE_COLOR = '4'
export const EDGE_COLOR = '6'

export const convention = {
  findNodes: ({ color }: AllCanvasNodeData) => color === NODE_COLOR,
  findEdges: ({ color }: AllCanvasNodeData) => color === EDGE_COLOR,
}
