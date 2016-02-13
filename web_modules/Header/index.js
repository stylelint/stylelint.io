import React, { Component } from "react"
import { Link } from "react-router"

import styles from "./index.css"

export default class Header extends Component {

  /* eslint-disable max-len */
  render() {
    return (
      <header className={ styles.root } role="banner">
        <p className={ styles.inner }>
          <Link
            className={ styles.logo } to="/"
          >
            <svg className={ styles.tux } width="40" height="39" viewBox="0 0 40 39" xmlns="http://www.w3.org/2000/svg"><g ><path d="M20.272 38.16c4.375-15.642 4.248-15.713 7.41-26.866l.76.44c.414.237.752.042.752-.434V5.98c.84-2.938 1.496-5.21 1.69-5.89h3.425L40 5.36l-3.738 3.23 2.827 3.057L20.46 38.16c-.09.15-.217.116-.188 0z"/><path d="M22.307 4.444c.17 0 .306.093.306.21v2.725c0 .114-.137.207-.306.207h-4.6c-.17 0-.307-.093-.307-.208V4.652c0-.115.137-.21.306-.21h4.6zm5.68-3.018l-5.062 2.922c.058.09.094.193.094.305V7.38c0 .14-.056.268-.146.37l5.113 2.952c.348.202.634.037.634-.365V1.792c0-.403-.284-.567-.633-.366zM16.993 7.38V4.652c0-.112.036-.215.094-.304l-5.062-2.924c-.348-.2-.634-.036-.634.366v8.545c0 .402.286.567.635.365l5.112-2.952c-.09-.103-.144-.23-.144-.37z"/><path d="M19.54 38.16h.188c-4.374-15.642-4.248-15.713-7.41-26.866l-.76.44c-.413.237-.752.042-.752-.434V5.98C9.966 3.043 9.31.77 9.116.09H5.692L0 5.36l3.737 3.23L.91 11.648 19.54 38.16z"/><ellipse cx="19.861" cy="11.897" rx="1.382" ry="1.382"/><ellipse cx="19.861" cy="20.112" rx="1.382" ry="1.382"/><ellipse cx="19.861" cy="28.329" rx="1.382" ry="1.382"/></g></svg>
            <span className={ styles.name }>{ "stylelint" }</span>
          </Link>
          <a
            className={ styles.menu }
            href="#navigation"
            id="nav-jump"
          >
            <svg
              className={ styles.burger }
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
            >
              <rect x="0" y="0" stroke-miterlimit="10" width="12" height="2"/>
              <rect x="0" y="5" stroke-miterlimit="10" width="12" height="2"/>
              <rect x="0" y="10" stroke-miterlimit="10" width="12" height="2"/>
            </svg>
            { "Menu" }
          </a>
        </p>
      </header>
    )
  }
}
