// control props

import React from 'react'
import {Switch} from '../switch'

// Here we're going to simplify our component slightly so you
// can learn the control props pattern in isolation from everything else.
// Next you'll put the pieces together.

class Toggle extends React.Component {
  static defaultProps = {
    onStateChange: () => {},
  }
  state = {on: false}
  // 🐨 let's add a function that can determine whether
  // the on prop is controlled. Call it `isControlled`.
  // It can accept a string called `prop` and should return
  // true if that prop is controlled
  // 💰 this.props[prop] !== undefined
  //
  // 🐨 Now let's add a function that can return the state
  // whether it's coming from this.state or this.props
  // Call it `getState` and have it return on from
  // state if it's not controlled or props if it is.
  isControlled(prop) {
    return this.props[prop] !== undefined
  }
  getState(state = this.state) {
    return Object.entries(state).reduce(
      (combinedState, [key, value]) => {
        if (this.isControlled(key)) {
          combinedState[key] = this.props[key]
        } else {
          combinedState[key] = value
        }
        return combinedState
      },
      {},
    )
  }
  internalStateState(changes, callback) {
    let allChanges
    this.setState(
      state => {
        const combinedState = this.getState(state)
        const changesObject =
          typeof changes === 'function'
            ? changes(combinedState)
            : changes
        allChanges = changesObject
        const nonControlledChanges = Object.entries(
          changesObject,
        ).reduce((newChanges, [key, value]) => {
          if (!this.isControlled(key)) {
            newChanges[key] = value
          }
          return newChanges
        }, {})
        return {...state, nonControlledChanges}
      },
      () => {
        this.props.onStateChange(allChanges)
        callback && callback()
      },
    )
  }
  toggle = () => {
    // 🐨 if the toggle is controlled, then we shouldn't
    // be updating state. Instead we should just call
    // `this.props.onToggle` with what the state should be
    this.internalStateState(({on}) => ({on: !on}))
  }
  render() {
    // 🐨 rather than getting state from this.state,
    // let's use our `getState` method.
    const {on} = this.getState()
    return <Switch on={on} onClick={this.toggle} />
  }
}

// These extra credit ideas are to expand this solution to elegantly handle
// more state properties than just a single `on` state.
// 💯 Make the `getState` function generic enough to support all state in
// `this.state` even if we add any number of properties to state.
// 💯 Add support for an `onStateChange` prop which is called whenever any
// state changes. It should be called with `changes` and `state`
// 💯 Add support for a `type` property in the `changes` you pass to
// `onStateChange` so consumers can differentiate different state changes.

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
class Usage extends React.Component {
  state = {bothOn: false}
  handleStateChange = ({on}) => {
    this.setState({bothOn: on})
  }
  render() {
    const {bothOn} = this.state
    const {toggle1Ref, toggle2Ref} = this.props
    return (
      <div>
        <Toggle
          on={bothOn}
          onStateChange={this.handleStateChange}
          ref={toggle1Ref}
        />
        <Toggle
          on={bothOn}
          onStateChange={this.handleStateChange}
          ref={toggle2Ref}
        />
      </div>
    )
  }
}
Usage.title = 'Control Props'

export {Toggle, Usage as default}
