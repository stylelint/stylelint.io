import React, { Component } from "react"
import TopBarProgressIndicator from "react-topbar-progress-indicator"

TopBarProgressIndicator.config({
  barColors: {
    "0": "#ed143d",
    "1.0": "#32cd32",
  },
  shadowBlur: 5,
})

export default class PageLoading extends Component {

  render() {
    return (
      <div>
        <TopBarProgressIndicator />
      </div>
    )
  }
}
