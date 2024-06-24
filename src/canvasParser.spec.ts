import { json } from 'graphlib'

import { getObsidianCanvasFile } from './getObsidianCanvasFile'
import { canvasParser } from './canvasParser'
import { splitByGroup } from './splitByGroup'


describe('canvas', () => {
  const canvasDataMock = getObsidianCanvasFile('test')
  const result = splitByGroup(canvasDataMock)

  const A = result.find(({ group }) => group === 'A')!
  const B = result.find(({ group }) => group === 'B')!
  const C = result.find(({ group }) => group === 'C')!
  const V = result.find(({ group }) => group === 'V')!

  test('grouping works correctly', () => {
    expect(A.nodes.length).toBe(5)
    expect(A.edges.length).toBe(4)

    expect(B.nodes.length).toBe(11)
    expect(B.edges.length).toBe(9)

    expect(V.nodes.length).toBe(5)
    expect(V.edges.length).toBe(5)
  })

  test('parsed correctly', () => {
    const a = canvasParser(A)
    const b = canvasParser(B)

    expect(a.getNodes().length).toBe(3)
    expect(a.getEdges().length).toBe(2)

    expect(b.getNodes().length).toBe(8)
    expect(b.getEdges().length).toBe(6)
  })

  test('many to one, one to many', () => {
    const m = canvasParser(C)

    expect(m.getNodes().length).toBe(8)
    expect(m.getEdges().length).toBe(6)
  })

  test('X', () => {
    const X = result.find(({ group }) => group === 'X')!

    expect(X.nodes.length).toBe(4)
    expect(X.edges.length).toBe(4)

    expect(() => canvasParser(X)).toThrow()
  })

  test('D', () => {
    const canvas = canvasParser(result.find(({ group }) => group === 'D')!)

    expect(canvas.getNodes().length).toBe(3)
    expect(canvas.getEdges().length).toBe(3)
  })

  test('E', () => {
    const canvas = canvasParser(result.find(({ group }) => group === 'E')!)

    expect(canvas.getNodes().length).toBe(2)
    expect(canvas.getEdges().length).toBe(3)
  })

  test('F', () => {
    const canvas = canvasParser(result.find(({ group }) => group === 'F')!)

    expect(canvas.getNodes().length).toBe(2)
    expect(canvas.getEdges().length).toBe(2)
  })

  test('G', () => {
    const canvas = canvasParser(result.find(({ group }) => group === 'G')!)

    expect(canvas.getNodes().length).toBe(2)
    expect(canvas.getEdges().length).toBe(4)
  })

  test('graphlib', () => {
    const canvas = canvasParser(getObsidianCanvasFile('example'))

    expect(canvas.graph.neighbors('91ece5c4b3f64f56')).toEqual(['bfcfe833f8ea4ecc', 'f818aa60b58b4e6a'])
    expect(canvas.graph.predecessors('91ece5c4b3f64f56')).toEqual(['bfcfe833f8ea4ecc'])
    expect(canvas.graph.successors('91ece5c4b3f64f56')).toEqual(['bfcfe833f8ea4ecc', 'f818aa60b58b4e6a'])

    expect(json.write(canvas.graph)).toMatchInlineSnapshot(`
{
  "edges": [
    {
      "name": "-145|-165",
      "v": "91ece5c4b3f64f56",
      "value": {
        "color": "6",
        "edgeName": "rollDice",
        "fromNodeId": "91ece5c4b3f64f56",
        "height": 125,
        "id": "8220e020baa77e48",
        "text": "# rollDice

The player rolls the dice 🎲",
        "toNodeId": "bfcfe833f8ea4ecc",
        "type": "text",
        "width": 280,
        "x": -145,
        "y": -165,
      },
      "w": "bfcfe833f8ea4ecc",
    },
    {
      "name": "-145|-165",
      "v": "91ece5c4b3f64f56",
      "value": {
        "color": "6",
        "edgeName": "rollDice",
        "fromNodeId": "91ece5c4b3f64f56",
        "height": 125,
        "id": "8220e020baa77e48",
        "text": "# rollDice

The player rolls the dice 🎲",
        "toNodeId": "f818aa60b58b4e6a",
        "type": "text",
        "width": 280,
        "x": -145,
        "y": -165,
      },
      "w": "f818aa60b58b4e6a",
    },
    {
      "name": "-680|-165",
      "v": "bfcfe833f8ea4ecc",
      "value": {
        "color": "6",
        "edgeName": "defineNumber",
        "fromNodeId": "bfcfe833f8ea4ecc",
        "height": 125,
        "id": "945390a7d9442ffc",
        "text": "# defineNumber",
        "toNodeId": "91ece5c4b3f64f56",
        "type": "text",
        "width": 280,
        "x": -680,
        "y": -165,
      },
      "w": "91ece5c4b3f64f56",
    },
  ],
  "nodes": [
    {
      "v": "bfcfe833f8ea4ecc",
      "value": {
        "color": "4",
        "height": 120,
        "id": "bfcfe833f8ea4ecc",
        "nodeName": "PlayerReady",
        "text": "# PlayerReady
",
        "type": "text",
        "width": 270,
        "x": -400,
        "y": -340,
      },
    },
    {
      "v": "91ece5c4b3f64f56",
      "value": {
        "color": "4",
        "height": 140,
        "id": "91ece5c4b3f64f56",
        "nodeName": "NumberDefined",
        "text": "# NumberDefined

The number is chosen by the game",
        "type": "text",
        "width": 270,
        "x": -400,
        "y": 20,
      },
    },
    {
      "v": "f818aa60b58b4e6a",
      "value": {
        "color": "4",
        "height": 80,
        "id": "f818aa60b58b4e6a",
        "nodeName": "WinGame",
        "text": "# WinGame",
        "type": "text",
        "width": 280,
        "x": -145,
        "y": 240,
      },
    },
  ],
  "options": {
    "compound": false,
    "directed": true,
    "multigraph": true,
  },
}
`)
  })
})
