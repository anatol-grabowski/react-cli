import React from 'react'
import PropTypes from 'prop-types'

export default class ClassComponent extends React.Component {
  render() {
    const {
      prop,
    } = this.props
    return (
      <div>

      </div>
    )
  }
}

ClassComponent.propTypes = {
  prop: PropTypes.string.isRequired,
}