import React from 'react'
// import { storiesOf } from '@storybook/react'
import Facets from '../components/Facets/Facets'
import '../styles/stories/FacetsTemplate.css'

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Facets',
  component: Facets,
};

// const stories = storiesOf('Facets', module)
//
// stories.add('Facets', ({ dimensions=[]}) => {
//   return (
//     <Facets dimensions={dimensions} />
//   )
// })

const Template = (args) => {
  const [selected, setSelected] = React.useState(null)
  const onFacetSelectHandler = (name, indices) => {
    console.debug('[ArticleBilbiography] @onFacetClickHandler', name, indices)
    // values and value
    setSelected(indices)
  }
  const sortedItems = args.items.map((item, idx) => ({
    ...item,
    idx
  }))

  return (
    <div className="FacetsTemplate">
      <Facets {...args} onSelect={onFacetSelectHandler}  />
      <section>
        {selected !== null && selected.join(',')}
      <ul>
        {sortedItems.map((d) => {
          if (Array.isArray(selected) && selected.indexOf(d.idx) === -1) {
            return null
          }
          return (
            <pre key={d.idx}>{d.idx} {JSON.stringify(d)}</pre>
          )
        })}
      </ul>
      </section>
    </div>
  )
}

export const Tags = Template.bind({});
Tags.args = {
  dimensions: [
    {
      fixed: true,
      name: 'tags',
      fn: (d) => d.tags,
      thresholdFn: () => 5,
      sortFn: (a,b) => {
        return a.indices.length === b.indices.length
          ? a.key > b.key
            ? 1 : -1
          : a.indices.length > b.indices.length ? -1 : 1
      },
      isArray: true
    },
    {
      fixed: true,
      name: 'authors',
      fn: (d) => d.authors,
      thresholdFn: () => 5,
      sortFn: (a,b) => {
        return a.indices.length === b.indices.length
          ? a.key > b.key
            ? 1 : -1
          : a.indices.length > b.indices.length ? -1 : 1
      },
      isArray: true
    }
  ],

  items: [
    { tags: ['a', 'c'], authors:['Author, A']},
    { tags: ['b', 'c'], authors:['Author, B'] },
    { tags: ['a', 'b', 'c'] },
    { tags: ['b', 'c'] },
    { tags: ['c'], authors:['Author, A'] },
    { tags: ['c'] },
    { tags: ['d'] },
    { tags: ['d'], authors:['Author, B'] },
    { tags: ['e'], authors:['Author, A'] },
    { tags: ['f','g','h', 'i', 'j'] }
  ]
}
