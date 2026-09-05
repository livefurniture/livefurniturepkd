import fs from 'fs'
import path from 'path'

const filesToDelete = [
  // public/
  'public/prod-coffee.png',
  'public/prod-dressing.png',
  'public/prod-mandir.png',
  'public/prod-wardrobe.png',

  // public/live/
  'public/live/LIVE (100).png',
  'public/live/LIVE (105).png',
  'public/live/LIVE (15).png',
  'public/live/LIVE (164).png',
  'public/live/LIVE (165).png',
  'public/live/LIVE (166).png',
  'public/live/LIVE (167).png',
  'public/live/LIVE (168).png',
  'public/live/LIVE (169).png',
  'public/live/LIVE (170).png',
  'public/live/LIVE (171).png',
  'public/live/LIVE (172).png',
  'public/live/LIVE (173).png',
  'public/live/LIVE (25).png',
  'public/live/LIVE (40).png',
  'public/live/prod_almira_wardrobe.png',
  'public/live/prod_bedside_table.png',
  'public/live/prod_bunker_bed.png',
  'public/live/prod_chest_of_drawers.png',
  'public/live/prod_coffee_table.png',
  'public/live/prod_crockery_shelf.png',
  'public/live/prod_dressing_table.png',
  'public/live/prod_sofa_bench.png',
]

let totalBytes = 0
let deletedCount = 0

console.log('=== DELETING LOCALLY SAVED PRODUCT IMAGES ===\n')

for (const relPath of filesToDelete) {
  const fullPath = path.resolve(process.cwd(), relPath)
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath)
    totalBytes += stats.size
    fs.unlinkSync(fullPath)
    console.log(`[DELETED] ${relPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`)
    deletedCount++
  } else {
    console.log(`[NOT FOUND] ${relPath}`)
  }
}

console.log(`\nDeleted ${deletedCount} local product images.`)
console.log(`Total disk space freed: ${(totalBytes / 1024 / 1024).toFixed(2)} MB (${totalBytes.toLocaleString()} bytes)`)
