import React from 'react'
import { X } from 'react-feather'

const DimensionGroupListItem = ({ group, isActive, onClick, onRemove }) => (
  <li
    className={`DimensionGroupListItem ${group.count > 0 && 'with-count'} ${isActive && 'active'}`}
  >
    <div
      className="DimensionGroupListItem_label"
      onClick={onClick}
    >
    {group.count > 0
      ? <span>{group.key}&nbsp;({group.count})</span>
      : <span>{group.key}&nbsp;({group.count})</span>
    }
    </div>
    {isActive && (
      <div className="DimensionGroupListItem_actions">
      <button
        onClick={onRemove}
        className="DimensionGroupListItem_actions_removeBtn"
      >
        <X size={14}/>
      </button>
      </div>
    )}
  </li>
)

export default DimensionGroupListItem
