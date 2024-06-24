import fs from 'node:fs'

import { CanvasData } from './canvas'


export const getObsidianCanvasFile = (filename: string) => JSON.parse(fs
    .readFileSync(`${__dirname}/${filename}.canvas`)
    .toString()) as CanvasData
