// src/hoc/withRouter.js
import { useRouter } from 'next/router'
import React from 'react'

const withRouter = (Component) => {
  return function WithRouterComponent(props) {
    const router = useRouter()
    return <Component {...props} router={router} />
  }
}

export default withRouter
