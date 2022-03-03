import React from 'react'
// import { storiesOf } from '@storybook/react'
import Facets from '../components/Facets/Facets'

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

  return (
    <>
    <Facets {...args} />
    {args.items.map((d,i) => (
      <pre key={i}>{JSON.stringify(d, null, 2)}</pre>
    ))}
    </>
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
