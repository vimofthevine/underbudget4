import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';

import useNavigateKeepingSearch from '../../../common/hooks/useNavigateKeepingSearch';
import TransactionDetailsList from './TransactionDetailsList';

const Transition = React.forwardRef(function Transition(props, ref) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Slide direction='up' ref={ref} {...props} />;
});

const TransactionDetailsDialog = ({ onExitNavigateTo }) => {
  const navigate = useNavigateKeepingSearch();
  const { transactionId } = useParams();

  const [isOpen, setIsOpen] = React.useState(true);

  const handleClose = () => setIsOpen(false);
  const handleExited = () => navigate(onExitNavigateTo);
  const handleModify = () => navigate('modify');

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={handleClose}
      onExited={handleExited}
      TransitionComponent={Transition}
    >
      <AppBar style={{ position: 'relative' }}>
        <Toolbar>
          <IconButton aria-label='close' color='inherit' edge='start' onClick={handleClose}>
            <CloseIcon />
          </IconButton>

          <Typography color='inherit' style={{ flex: 1 }} variant='h6'>
            Details
          </Typography>

          <Button color='inherit' onClick={handleModify}>
            Modify
          </Button>
        </Toolbar>
      </AppBar>

      <TransactionDetailsList id={transactionId} />
    </Dialog>
  );
};

TransactionDetailsDialog.propTypes = {
  onExitNavigateTo: PropTypes.string,
};

TransactionDetailsDialog.defaultProps = {
  onExitNavigateTo: '..',
};

export default TransactionDetailsDialog;
