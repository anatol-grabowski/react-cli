import React from 'react'
import PropTypes from 'prop-types'

export default function FunctionalComponent(props) {
  const {
    prop,
  } = props
  return (
    <div>

    </div>
  )
}

FunctionalComponent.propTypes = {
  prop: PropTypes.string.isRequired,
}