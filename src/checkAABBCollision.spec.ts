import { CanvasNodeData } from './canvas'
import { checkAABBCollision } from './checkAABBCollision'


describe('checkAABBCollision', () => {
  it('should return true when two nodes are colliding', () => {
    const nodeA = { x: 50, y: 50, width: 30, height: 30 } as CanvasNodeData
    const nodeB = { x: 70, y: 70, width: 20, height: 40 } as CanvasNodeData

    expect(checkAABBCollision(nodeA)(nodeB)).toBe(true)
  })

  it('should return false when two nodes are not colliding', () => {
    const nodeA = { x: 50, y: 50, width: 30, height: 30 } as CanvasNodeData
    const nodeB = { x: 100, y: 100, width: 20, height: 40 } as CanvasNodeData

    expect(checkAABBCollision(nodeA)(nodeB)).toBe(false)
  })
})
