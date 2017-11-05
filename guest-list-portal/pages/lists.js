import { Component } from 'react'
import { connect, bindActionCreators } from 'redux'
import withRedux from 'next-redux-wrapper'
import Link from 'next/link'
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Anchor from 'grommet/components/Anchor';
import Search from 'grommet/components/Search';
import List from 'grommet/components/List';
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';
import AddIcon from 'grommet/components/icons/base/Add';
import { getLists, getListsSuccess, getListsFailure, searchList, updateSearchList, makeStore } from '../store'
import Layout from '../components/layout'
import EventListItem from '../components/event-list/event-list-item'

class Lists extends Component {
  constructor(props) {
    super(props)
    this._onSearch = this._onSearch.bind(this)
  }
  static getInitialProps ({ store, isServer }) {
    const action = getLists();

    store.dispatch(action);

    return action.payload
      .then(response => response.json())
      .then(response => {
        store.dispatch(getListsSuccess(response))
        return { custom: 'custom ' }
      })
      .catch(err => {
        store.dispatch(getListsFailure(err))
      })
  }

  _onSearch(event) {
    const query = event.target.value;
    this.props.dispatch(searchList(query))

    const listWithFiltered = this.props.unfilteredLists.filter(list => list.name.toLowerCase().indexOf(query) > -1)

    this.props.dispatch(updateSearchList(listWithFiltered, this.props.unfilteredLists))
  }

  _onSelect() {

  }

  render () {
    const { lists, unfilteredLists, loadingList, loadingFailed, searchText } = this.props

    return (
      <Layout>
        <Box>
          <Header size='large' pad={{ horizontal: 'medium' }}>
            <Title responsive={false}>
              <span>Lists</span>
            </Title>
            <Search inline={true} fill={true} size='medium' placeHolder='Search by list name'
              value={searchText} onDOMChange={this._onSearch} />
            {/*<Link href="/lists/add">
              <Anchor icon={<AddIcon />} a11yTitle={`Add a list`} />
            </Link>*/}
          </Header>
          <List selectable={true} onSelect={this._onSelect}>
            {lists.map((list, index) => (
              <EventListItem key={list.id} item={list} index={index} />
            ))}
          </List>
          <ListPlaceholder filteredTotal={lists.length}
            unfilteredTotal={unfilteredLists.length}
            emptyMessage='You do not have any list at the moment.' />
        </Box>
      </Layout>
    )
  }
}

Lists = withRedux(makeStore, ({listsReducer}) => ({ lists: listsReducer.lists, unfilteredLists: listsReducer.unfilteredLists, loadingList: listsReducer.loadingList, loadingFailed: listsReducer.loadingFailed, searchText: listsReducer.searchText }))(Lists);

export default Lists;

// export default withRedux(initStore, null, mapDispatchToProps)(Lists)
