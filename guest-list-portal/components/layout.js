import { Component } from 'react'
import Head from 'next/head'
import App from 'grommet/components/App'
import Split from 'grommet/components/Split'
import Sidebar from 'grommet/components/Sidebar'
import Header from 'grommet/components/Header'
import Footer from 'grommet/components/Footer'
import Title from 'grommet/components/Title'
import Anchor from 'grommet/components/Anchor'
import Menu from 'grommet/components/Menu'
import Button from 'grommet/components/Button'
import CloseIcon from 'grommet/components/icons/base/Close'
import Link from 'next/link'
import style from 'styles/app.scss'

class Layout extends Component {
  constructor(props) {
    super(props)
  }

  _onResponsive() {

  }

  render() {
    const { children } = this.props

    return (
      <App centered={false}>
        <Head>
          <title>GuestList</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <style dangerouslySetInnerHTML={{ __html: style }} />
        <Split
          priority="right"
          flex="right">
          <Sidebar colorIndex="neutral-1" fixed={true} size="small">
            <Header size="large" justify="between" pad={{horizontal: 'medium'}}>
              <Title a11yTitle="Close Menu">
                GuestList
              </Title>
            </Header>
            <Menu fill={true} primary={true}>
              <Link href="/lists">
                <Anchor label="Lists" />
              </Link>
            </Menu>
            <Footer pad={{horizontal: 'medium', vertical: 'small'}}>
              GuestList	&copy; 2017
            </Footer>
          </Sidebar>
          {children}
        </Split>
      </App>
    )
  }
}

export default Layout
