import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';

import EnvelopeCategoryPropTypes from '../../utils/envelope-category-prop-types';
import EnvelopeCategoryActionsButton from '../EnvelopeCategoryActionsButton';
import EnvelopeListItem from '../EnvelopeListItem';

const EnvelopeCategoryListItem = ({ category }) => {
  const [open, setOpen] = React.useState(true);
  const handleToggle = () => setOpen((old) => !old);
  return (
    <>
      <ListItem button onClick={handleToggle}>
        <ListItemIcon>{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</ListItemIcon>
        <ListItemText primary={category.name} />
        <ListItemSecondaryAction>
          <EnvelopeCategoryActionsButton category={category} />
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={open}>
        <List component='div' dense disablePadding>
          {category.envelopes.map((envelope) => (
            <EnvelopeListItem envelope={envelope} key={envelope.id} />
          ))}
        </List>
      </Collapse>
    </>
  );
};

EnvelopeCategoryListItem.propTypes = {
  category: EnvelopeCategoryPropTypes.isRequired,
};

export default EnvelopeCategoryListItem;
