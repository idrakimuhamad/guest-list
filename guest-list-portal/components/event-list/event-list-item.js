import { Component, PropTypes } from 'react';
import Link from 'next/link'
import { connect } from 'react-redux'
import ListItem from 'grommet/components/ListItem';
import Box from 'grommet/components/Box';
import StatusIcon from 'grommet/components/icons/Status';
import Timestamp from 'grommet/components/Timestamp';
import Meter from 'grommet/components/Meter';
import Value from 'grommet/components/Value';

class EventListItem extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { item, index } = this.props
    let separator;

    if (index === 0) separator = 'horizontal'

    return (
      <ListItem align="start" justify="between" separator={separator}
        pad={{horizontal: 'medium', vertical: 'medium', between: 'medium'}}>
        <Box direction="row" pad={{between: 'small'}}>
          <Link href={`/list?id=${item.id}`} as={`/lists/${item.id}`}>
            <span className="message">
              {item.name}
            </span>
          </Link>
        </Box>
      </ListItem>
    )
  }
}

export default connect(state => state)(EventListItem)
