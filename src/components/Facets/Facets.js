import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Dimension, {
  MethodFilter,
  MethodReplace,
  MethodRemove,
  MethodReset,
} from './Dimension'

/**
 * sort function a
 * @return [{ selected, isActive, dims }]
 */
export function sortFn({
  by='authors',
  direction=1,
  dimensions=[]
} = {}) {
  // get dimension
  const dimension = dimensions.find(d => d.name === by)
  if (!dimension) {
    return
  }
  return (a, b) => {
    const aValue = dimension.fn(a)
    const bValue = dimension.fn(b)
    if (aValue && bValue) {
      return aValue > bValue ? -direction : direction
    } else if (aValue) {
      return -direction
    } else if (bValue) {
      return direction
    } else {
      return 0
    }
  }
}

/**
 * Hook useFacetsSelection
 * @return [{ selected, isActive, dims }]
 */
function useFacetsSelection(dimensions = []) {
  const [{ selected, isActive, dims }, setResult] = useState({
    selected: [],
    isActive: false,
    // resulting in { dim1: [], dim2: [], ... dimN: []}
    dims: dimensions.reduce((acc, d) => {
      acc[d.name] = {
        selected: [],
        keys: [],
        values: {}, // object of { key: [...indices] }
      }
      return acc
    }, {})
  })

  const changeSelection = ({
    name='',
    key='',
    indices=[],
    method
  }) => {
    const _dims = { ... dims }
    const dimsKeys = Object.keys(dims)
    if (!dimsKeys.includes(name)) {
      console.error('[useFacetsSelection] {name} is not a valid dimension:', name)
      return
    }
    if (![MethodFilter, MethodReplace, MethodRemove, MethodReset].includes(method)) {
      console.error('[useFacetsSelection] {method} is not a valid dimension:', method)
      return
    }
    console.debug('[useFacetsSelection]', {name, key, indices, method})
    if (method === MethodFilter) {
      _dims[name].values[key] = indices
      if (_dims[name].selected.length) {
        _dims[name].selected = _dims[name].selected.filter(d => indices.includes(d))
      } else {
        _dims[name].selected = indices
      }
      // this would be for MethodAdd
      // _dims[name].selected = _dims[name].selected
      //   // add indices
      //   .concat(indices)
      //   // remove dupes
      //   .filter((d, i, arr) => arr.indexOf(d) === i)
      if (!_dims[name].keys.includes(key)) {
        _dims[name].keys.push(key)
      }
    } else if (method === MethodRemove) {
      delete _dims[name].values[key]
      const keyToRemove = _dims[name].keys.indexOf(key)
      if (keyToRemove > -1) {
        _dims[name].keys.splice(keyToRemove, 1)
      }
      if (!_dims[name].keys.length) {
        _dims[name].selected = []
      } else if (_dims[name].keys.length === 1) {
        _dims[name].selected = Object.values(_dims[name].values).reduce((acc, d) => d, [])
      } else {
        _dims[name].selected = Object.values(_dims[name].values).reduce((acc, values, i) => {
          if (i === 0) {
            return values
          }
          return acc.filter(d => !values.includes(d))
        }, [])
      }
    } else if (method === MethodReset) {
      _dims[name].selected = []
      _dims[name].keys = []
    } else if (method === MethodReplace) {
      _dims[name].selected = indices
      _dims[name].keys = [key]
    }

    setResult({
      // apply cascading, exclusive filters
      selected: dimsKeys.reduce((acc, k) => {
        if (_dims[k].selected.length === 0) {
          return acc
        }
        if (!acc.length) {
          // first array containing some items to start with.
          return _dims[k].selected
        }
        // do intersection between previous acc and current selection
        return acc.filter(d => _dims[k].selected.includes(d))
      }, []),
      isActive: dimsKeys.reduce((acc, k) => {
        return acc || _dims[k].selected.length > 0
      }, false),
      dims: _dims
    })
  }

  console.debug('[useFacetsSelection]', {selected, isActive, dims})

  return [
    { selected, isActive, dims },
    changeSelection
  ]
}


const Facets = ({
  dimensions = [], // ['tags', 'author.orcid']
  items = [],
  reset=false,
  // memoid='',
  onSelect,
  onInit,
  className, style,
  ShowMoreLabel = ({ active, n }) => (<span>{active ? 'showLess': 'showMore'} ({n})</span>),
  DimensionsLabel= ({ dimension }) => (<span>{dimension.name}</span>)
}) => {
  // Resulting state: { selected: [0, 14, 15 ...]}
  const [{ selected, isActive, dims }, setSelection] = useFacetsSelection(dimensions)
  const [stats,setStats] = useState(dimensions.reduce((acc, d) => {
    acc[d.name] = 0
    return acc
  },{
    total: items.length,
    completed: [],
    available: dimensions.map(d => d.name)
  }))

  const onInitHandler = (dimension, groups) => {
    console.debug('[Facets] @onInit', dimension.name, groups.length)
    // merge as there are concurrent onInit events
    // https://fr.reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables
    setStats(state => ({
        ...state,
        [dimension.name]: groups.length,
        completed: state.completed.concat([dimension.name])
    }))
  }

  const onResetHandler = (e, name) => {
    e.stopPropagation()
    console.debug('[Facets] @onResetHandler', name)
    setSelection({
      name,
      method: MethodReset
    })
  }

  const onSelectHandler = (name, key, indices, method='filter') => {
    setSelection({ name, key, indices, method })
  }

  useEffect(() => {
    console.debug('[Facets] @useEffect stats', stats)
    if (typeof onInit === 'function' && stats.completed.length === stats.available.length) {
      onInit({...stats})
    }
  }, [stats])

  useEffect(() => {
    console.debug('[Facets] @useEffect selected:', selected, 'isActive:', isActive)
    if (typeof onSelect === 'function') {
      onSelect(name, isActive ? selected: null)
    }
  }, [selected])

  console.debug('[Facets] rendered, isActive: ', isActive,
    'n.items:', items.length, 'n. selected:',
    selected.length,
    'dimensions:', dimensions.length
  )

  return (
    <div className={`${className}`} style={style}>
      {dimensions.map((dimension) => (
        <div className={`Facets_dimension ${dimension.name}`} key={dimension.name}>
          <h3 className="Facets_dimensionHeading">
            <DimensionsLabel dimension={dimension}/>
          </h3>
          <Dimension
            items={items}
            selected={selected}
            activeKeys={dims[dimension.name].keys}
            isActive={isActive}
            name={dimension.name}
            fn={dimension.fn}
            sortFn={dimension.sortFn}
            thresholdFn={dimension.thresholdFn}
            fixed={dimension.fixed}
            onSelect={onSelectHandler}
            onInit={onInitHandler}
            ShowMoreLabel={ShowMoreLabel}
          >
            {reset === true && dims[dimension.name].selected.length > 0 && (
              <button onClick={(e) => onResetHandler(e, dimension.name)}>reset</button>
            )}
          </Dimension>
        </div>
      ))}
    </div>
  )
}
//
Facets.propTypes = {
  dimensions: PropTypes.arrayOf(PropTypes.shape({})),
  items: PropTypes.array,
  reset: PropTypes.bool,
  onSelect: PropTypes.func,
  onInit: PropTypes.func,
  ShowMoreLabel: PropTypes.func,
};

Facets.defaultProps = {
  dimensions: [],
  items: [],
  reset: false,
  onSelect: (args) => { console.log(args)},
  onInit: (args) => { console.log(args)}
};

// export default React.memo(Facets, (prevProps, nextProps) => prevProps.memoid === nextProps.memoid)
export default Facets
