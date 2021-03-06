import React, { PropTypes } from 'react'

const colorMap = [
  'blank',
  'blue',
  'green',
  'red',
  'yellow',
  'magenta',
  'brown',
  'grey',
  'black'
]
colorMap[42] = 'black'

const GridCell = ({ color }) => (
  <div className={`GridCell ${colorMap[color]}`} />
)

GridCell.propTypes = {
  color: PropTypes.number.isRequired,
}

export default GridCell
