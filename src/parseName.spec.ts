import { parseName } from './parseName'


describe('parseName', () => {
  test.each([
    ['# Abc', 'Abc'],
    ['#     Def', 'Def'],
    ['#Ghi', 'Ghi'],
    ['  #   Jkl   ', 'Jkl'],
    ['# Mno\nSecond line\nThird line', 'Mno'],
    ['', ''],
    ['Some text without heading', ''],
  ])('should parse name from "%s"', (text, expected) => {
    expect(parseName(text)).toEqual(expected)
  })
})
