import { Component } from 'react'
import { connect, bindActionCreators } from 'redux'
import withRedux from 'next-redux-wrapper'
import Link from 'next/link'
import Animate from 'grommet/components/Animate'
import Split from 'grommet/components/Split'
import Sidebar from 'grommet/components/Sidebar'
import SkipLinkAnchor from 'grommet/components/SkipLinkAnchor'
import Box from 'grommet/components/Box'
import Header from 'grommet/components/Header'
import Heading from 'grommet/components/Heading'
import Title from 'grommet/components/Title'
import Section from 'grommet/components/Section'
import Label from 'grommet/components/Label'
import Search from 'grommet/components/Search'
import Anchor from 'grommet/components/Anchor'
import Button from 'grommet/components/Button'
import AddIcon from 'grommet/components/icons/base/Add'
import Tiles from 'grommet/components/Tiles'
import Tile from 'grommet/components/Tile'
import FormField from 'grommet/components/FormField'
import CheckBox from 'grommet/components/CheckBox'
import Meter from 'grommet/components/Meter'
import Value from 'grommet/components/Value'
import StatusIcon from 'grommet/components/icons/Status'
import UserIcon from 'grommet/components/icons/base/User'
import CloseIcon from 'grommet/components/icons/base/Close'
import TrashIcon from 'grommet/components/icons/base/Trash'
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder'
import { getList, getListSuccess, getListFailure, getTables, getTablesSuccess, getTablesFailure, getGuests, getGuestsSuccess, getGuestsFailure, getGuest, getGuestSuccess, getGuestFailure, searchGuestList, updateGuestList, updateTablesList, updateGuestRsvp, updateGuestRsvpSuccess, updateGuestRsvpFailure, updateGuestArrival, updateGuestArrivalSuccess, updateGuestArrivalFailure, clearGuest, deleteGuest, deleteGuestSuccess, deleteGuestFailure } from '../store'
import { initStore, makeStore } from '../store'
import Layout from '../components/layout'

class List extends Component {
  constructor(props) {
    super(props)
    this._onSearch = this._onSearch.bind(this)
    this._updateRsvp = this._updateRsvp.bind(this)
    this._updateArrival = this._updateArrival.bind(this)
    this._closeSidebar = this._closeSidebar.bind(this)
    this._removeGuest = this._removeGuest.bind(this)
  }
  static getInitialProps ({ store, query}) {
    const actionList = getList(query.id)
    const actionTables = getTables(query.id)
    const actionGuests = getGuests(query.id)

    store.dispatch(actionList)
    store.dispatch(actionTables)
    store.dispatch(actionGuests)

    return Promise.all([
      actionList.payload,
      actionTables.payload,
      actionGuests.payload
    ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(responses => {
      store.dispatch(getListSuccess(responses[0]))
      store.dispatch(getTablesSuccess(responses[1]))
      store.dispatch(getGuestsSuccess(responses[2]))
    })
    .catch(errors => {
      store.dispatch(getListFailure(errors[0]))
      store.dispatch(getTablesFailure(errors[1]))
      store.dispatch(getGuestsFailure(errors[2]))
    })
  }

  _onSearch(event) {
    // clear the selected guest
    this.props.dispatch(clearGuest())

    const query = event.target.value
    this.props.dispatch(searchGuestList(query))

    if (query.trim().length) {
      this._filterTableWithGuest(query)
    } else {
      this.props.dispatch(updateGuestList(this.props.unfilteredGuests, this.props.unfilteredGuests))
      this.props.dispatch(updateTablesList(this.props.unfilteredTables, this.props.unfilteredTables))
    }
  }

  _filterTableWithGuest(query) {
    const guestsWithFiltered = this.props.unfilteredGuests.filter(guest => guest.name.toLowerCase().indexOf(query.toLowerCase()) > -1)
    const tableInFilter = this.props.unfilteredTables.filter(table => {
      const inTable = guestsWithFiltered.find(guest => guest.tableId === table.id)

      return inTable
    })

    this.props.dispatch(updateGuestList(guestsWithFiltered, this.props.unfilteredGuests))
    this.props.dispatch(updateTablesList(tableInFilter, this.props.unfilteredTables))
  }

  _groupGuestsInTable(tables, guests) {
    const tablesWithGuest = tables.map(table => {
      const guestsInTable = guests.filter(guest => guest.tableId === table.id)
      const totalPax = guestsInTable.reduce((total, guest) => guest.pax + total, 0)

      return {
        ...table,
        guests: guestsInTable,
        totalPax
      }
    })

    return tablesWithGuest
  }

  _viewGuest(guestId) {
    const actionGuest = getGuest(guestId)

    this.props.dispatch(actionGuest)

    actionGuest.payload
      .then(response => response.json())
      .then(response => this.props.dispatch(getGuestSuccess(response)))
      .catch(err => this.props.dispatch(getGuestFailure(err)))
  }

  _updateRsvp() {
    const { guest } = this.props
    const actionRsvp = updateGuestRsvp(guest.id)

    this.props.dispatch(actionRsvp)

    actionRsvp.payload
      .then(response => response.json())
      .then(response => this.props.dispatch(updateGuestRsvpSuccess(response[0])))
      .catch(err => this.props.dispatch(updateGuestRsvpFailure(err)))
  }

  _updateArrival() {
    const { guest } = this.props
    const actionArrival = updateGuestArrival(guest.id)

    this.props.dispatch(actionArrival)

    actionArrival.payload
      .then(response => response.json())
      .then(response => { this.props.dispatch(updateGuestArrivalSuccess(response[0]))})
      .catch(err => this.props.dispatch(updateGuestArrivalFailure(err)))
  }

  _closeSidebar() {
    this.props.dispatch(clearGuest())
  }

  _removeGuest() {
    const { guest, dispatch } = this.props
    const toDelete = confirm('Are you sure you want to remove this guest?')

    if (toDelete) {
      const actionDelete = deleteGuest(guest.id)

      dispatch(actionDelete)

      actionDelete.payload
        .then(response => response.json())
        .then(response => {
          dispatch(deleteGuestSuccess(guest.id))
          this._closeSidebar()
        })
        .catch(err => dispatch(deleteGuestFailure(err)))
    }
  }

  render () {
    const { list, tables, guests, guest, searchText } = this.props
    const tablesWithGuest = this._groupGuestsInTable(tables, guests)

    return (
      <Layout>
        <Split flex="left" separator={guest.name ? true : false} priority={guest.name ? 'right' : 'left'}>
          <Box>
            <Header fixed={true} size='large' pad={{ horizontal: 'medium' }}>
              <Title responsive={false}>
                <span>{ list.name }</span>
              </Title>
              <Search inline={true} size='medium'
                placeHolder='Search'
                value={searchText} onDOMChange={this._onSearch} />
              {/*<Link href="/lists/list/add">
                <Anchor icon={<AddIcon />} a11yTitle={`Add a guest`} />
              </Link>*/}
            </Header>
            {tablesWithGuest.map(table => (
              <Section key={table.id} pad='none'>
                <Header size='small' justify='start' responsive={false}
                  separator='top' pad={{ horizontal: 'small' }}>
                 <Label size='small'>{table.name}</Label>
                 <Box margin={{ horizontal: 'medium' }}>
                   <Link href={`/table?addGuest=true&tableId=${table.id}&listId=${list.id}`} as={`/lists/${list.id}/table/add-guest/${table.id}`}>
                     <Anchor icon={<AddIcon />} a11yTitle={`Add a guest to this table`} />
                   </Link>
                  </Box>
                 { !searchText && <Box>
                   <Value value={table.totalPax}
                    units='pax'
                    align='start'
                    size='xsmall' />
                    <Meter value={table.totalPax} max={10} size='xsmall' />
                  </Box>
                  }
                </Header>
                {table.guests.length ?
                <Tiles flush={false} fill={false} selectable={true}>
                  {table.guests.map(guest => (
                    <Tile key={guest.id} align="stretch" pad="small" direction="column" size="small" a11yTitle={`View Guest's Details`} onClick={this._viewGuest.bind(this, guest.id)}>
                      <strong>{guest.name}</strong>
                      <div>
                        <StatusIcon value={guest.isArrived ? 'ok' : 'disabled'} size="small" />
                        <span className="secondary">{guest.pax} pax</span>
                      </div>
                    </Tile>
                  ))}
                </Tiles>
                : <Header size='small' justify='start' responsive={false} pad={{ horizontal: 'small' }}>
                   <span className="secondary">No guests in this table</span>
                  </Header>
                }
              </Section>
            ))}
          </Box>
          { guest.id &&
            /*<Animate enter={{"animation": "slide-left", "duration": 1000, "delay": 0}} keep={true}>*/
              <Sidebar size="medium" colorIndex="light-2">
                <SkipLinkAnchor label="Right Panel" />
                <Header pad={{horizontal: 'medium', vertical: 'medium'}}
                  justify="between" size="large" >
                  <Heading tag="h3" margin='none'>{ guest.name }</Heading>
                  <Button icon={<CloseIcon />} onClick={this._closeSidebar} a11yTitle={`Close Details`} />
                </Header>
                <Box pad="small">
                  <div>
                    <Button align="start" plain={true}
                      icon={<UserIcon />} label={`${guest.pax} pax`} />
                  </div>
                </Box>
                <Box pad="small">
                  <FormField label="RSVP">
                    <CheckBox name="rsvp" toggle={true} checked={guest.rsvp}  onChange={this._updateRsvp} />
                  </FormField>
                  <FormField label="Arrived">
                    <CheckBox name="arrived" toggle={true} checked={guest.isArrived}  onChange={this._updateArrival} />
                  </FormField>
                </Box>
                <Box pad={{ "horizontal": "small", "vertical": "medium" }}>
                  <Button icon={<TrashIcon />} label="Remove" onClick={this._removeGuest} a11yTitle={`Remove Guest`} plain={true} />
                </Box>
              </Sidebar>
            /*</Animate>*/
        }
        </Split>
      </Layout>
    )
  }
}

List = withRedux(makeStore, ({listReducer}) => ({ list: listReducer.list, guests: listReducer.guests, unfilteredGuests: listReducer.unfilteredGuests, tables: listReducer.tables, unfilteredTables: listReducer.unfilteredTables, loadingList: listReducer.loadingList, loadingFailed: listReducer.loadingFailed, searchText: listReducer.searchText, guest: listReducer.guest }))(List);

export default List;
