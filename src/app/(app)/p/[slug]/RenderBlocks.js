import { HeroV2Block } from './blocks/HeroV2Block'
import { ProductReelBlock } from './blocks/ProductReelBlock'

// Maps a block's `blockType` to its presentational component. Adding a new
// block = add its renderer here. Same idea as a WordPress block registry.
const components = {
  heroV2: HeroV2Block,
  productReel: ProductReelBlock,
}

export function RenderBlocks({ blocks }) {
  return (
    <>
      {blocks.map((block, i) => {
        const Component = components[block.blockType]
        if (!Component) return null
        return <Component key={block.id ?? i} {...block} />
      })}
    </>
  )
}
