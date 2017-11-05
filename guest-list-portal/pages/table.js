import { Component } from 'react'
import { connect, bindActionCreators } from 'redux'
import withRedux from 'next-redux-wrapper'
import Router from 'next/router'
import Link from 'next/link'
import Article from 'grommet/components/Article'
import Header from 'grommet/components/Header'
import Heading from 'grommet/components/Heading'
import Anchor from 'grommet/components/Anchor'
import Form from 'grommet/components/Form'
import Footer from 'grommet/components/Footer'
import FormFields from 'grommet/components/FormFields'
import FormField from 'grommet/components/FormField'
import NumberInput from 'grommet/components/NumberInput'
import CheckBox from 'grommet/components/CheckBox'
import Button from 'grommet/components/Button'
import CloseIcon from 'grommet/components/icons/base/Close'
import { addingGuest, addingGuestSuccess, addingGuestFailed, getTable, getTableSuccess, getTableFailure, updateGuestForm, makeStore, clearGuest } from '../store'
import Layout from '../components/layout'

class Table extends Component {
  constructor(props) {
    super(props)
    this._onChange = this._onChange.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  static getInitialProps ({ store, query }) {
    const actionTable = getTable(query.tableId)

    store.dispatch(actionTable)

    return actionTable.payload
      .then(response => response.json())
      .then(response => {
        store.dispatch(getTableSuccess(response))

        return {
          listId: query.listId,
          tableId: query.tableId
        }
      })
      .catch(err => store.dispatch(getTableFailure(err)))
  }

  _onChange(event) {
    const value = event.target.name === 'rsvp' ? !this.props.rsvp : event.target.value

    this.props.dispatch(updateGuestForm({ [event.target.name]: value }))
  }

  _onSubmit(event) {
    event.preventDefault()

    const { listId, tableId, name, pax, rsvp, dispatch } = this.props

    if (listId && tableId && name && pax && rsvp) {
      const actionAdd = addingGuest({listId, tableId, name, pax, rsvp})

      dispatch(actionAdd)

      actionAdd.payload
        .then(response => response.json())
        .then(response => {
          dispatch(addingGuestSuccess(response))
          Router.push(`/list?id=${listId}`, `/lists/${listId}`)
        })
        .catch(err => this.props.dispatch(addingGuestFailed(err)))
    }
  }

  render() {
    const { listId, table, name, pax, rsvp } = this.props

    return (
      <Layout>
        <Article align="center" pad={{horizontal: 'medium'}} primary={true}>
          <Form onSubmit={this._onSubmit}>
            <Header size="large" justify="between" pad="none">
              <Heading tag="h2" margin="none" strong={true}>
                Add Guest into {table.name}
              </Heading>
              <Link href={`/list?id=${listId}`} as={`/lists/${listId}`}>
                <Anchor icon={<CloseIcon />}
                  a11yTitle="Back to list"/>
              </Link>
            </Header>

            <FormFields>
              <fieldset>
                <FormField htmlFor="name" label="Name">
                  <input ref="name" id="name" name="name" type="text" value={name} onChange={this._onChange} />
                </FormField>
                <FormField htmlFor="pax" label="Pax">
                  <NumberInput id="pax" name="pax" min={1} max={10} value={pax} onChange={this._onChange} />
                </FormField>
                <FormField htmlFor="rsvp" label="RSVP">
                  <CheckBox name="rsvp" toggle={true} checked={rsvp}  onChange={this._onChange} />
                </FormField>
              </fieldset>
            </FormFields>

            <Footer pad={{vertical: 'medium'}} justify="between">
              <Button type="submit" primary={true} label="Add"
                onClick={this._onSubmit} />
            </Footer>
          </Form>
        </Article>
      </Layout>
    )
  }
}

Table = withRedux(makeStore, ({guestReducer}) => ({ table: guestReducer.table, name: guestReducer.name, pax: guestReducer.pax, rsvp: guestReducer.rsvp, addingGuestSuccess: guestReducer.addingGuestSuccess, addingGuestFailed: guestReducer.addingGuestFailed }))(Table);

export default Table;
