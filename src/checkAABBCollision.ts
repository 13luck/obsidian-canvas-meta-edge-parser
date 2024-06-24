import { CanvasNodeData } from './canvas'


export const checkAABBCollision = <Node extends CanvasNodeData>(A: Node) => (B: Node) => {
  const AisToTheRightOfB = A.x > B.x + B.width
  const AisToTheLeftOfB = A.x + A.width < B.x
  const AisAboveB = A.y + A.height < B.y
  const AisBelowB = A.y > B.y + B.height

  return !(AisToTheRightOfB || AisToTheLeftOfB || AisAboveB || AisBelowB)
}
