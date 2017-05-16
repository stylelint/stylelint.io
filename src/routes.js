import React from "react"
import { Route } from "react-router"
import { PageContainer as PhenomicPageContainer } from "phenomic"

import AppContainer from "./AppContainer"
import Page from "./layouts/Page"
import PageError from "./layouts/PageError"
import DemoPage from "./layouts/DemoPage"
import RulePage from "./layouts/RulePage"

const PageContainer = (props) => (
  <PhenomicPageContainer
    { ...props }
    layouts={{
      DemoPage,
      RulePage,
      Page,
      PageError,
    }}
  />
)

export default (
  <Route component={ AppContainer }>
    <Route path="*" component={ PageContainer } />
  </Route>
)
