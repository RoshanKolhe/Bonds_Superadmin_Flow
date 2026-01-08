// import PropTypes from 'prop-types';
// // @mui
// import Button from '@mui/material/Button';

// import MenuItem from '@mui/material/MenuItem';
// import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
// import TableCell from '@mui/material/TableCell';
// import IconButton from '@mui/material/IconButton';
// import ListItemText from '@mui/material/ListItemText';
// // hooks
// import { useBoolean } from 'src/hooks/use-boolean';
// // components
// import { Box, Tooltip } from '@mui/material';
// import Label from 'src/components/label';
// import Iconify from 'src/components/iconify';
// import CustomPopover, { usePopover } from 'src/components/custom-popover';
// import { ConfirmDialog } from 'src/components/custom-dialog';
// import { useNavigate } from 'react-router';
// import { paths } from 'src/routes/paths';
// import { useState } from 'react';
// import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';


// // ----------------------------------------------------------------------

// export default function ValuerTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }) {
//   const { id, currentStatus, createdAt } = row;
//   const navigate = useNavigate();
//   const confirm = useBoolean();
//   const popover = usePopover();

//   const localStatusMapper = [
//     { label: 'Regulatory Filing', code: 'Regulatory filings' },
//     { label: 'Trustee Due Diligence', code: 'trustee_due_diligence' },
//     { label: 'Principle Listing Approval', code: 'principle_listing_approval' },
//     { label: 'ISIN Activation', code: 'isin_activation' },
//     { label: 'Execute Documents', code: 'execute_document' },
//     { label: 'Launch Issue', code: 'launch_issue' }
//   ]


//   const [rejectOpen, setRejectOpen] = useState(false);
//   const [rejectReason, setRejectReason] = useState('');
//   const [selectedDocumentId, setSelectedDocumentId] = useState(null);

//   // const handleApprove = async (documentId) => {
//   //   try {
//   //     await axiosInstance.patch('/company-profiles/document-verification', {
//   //       status: 1,
//   //       documentId,
//   //       reason: '',
//   //     });

//   //     enqueueSnackbar('Document Approved', { variant: 'success' });
//   //     refreshDocuments(); // Refresh instantly
//   //   } catch (err) {
//   //     enqueueSnackbar('Approval failed', { variant: 'error' });
//   //   }
//   // };

//   // OPEN REJECT POPUP
//   // const handleRejectClick = (documentId) => {
//   //   setSelectedDocumentId(documentId);
//   //   setRejectOpen(true);
//   // };



//   //  const handleRejectSubmit = async () => {
//   //     if (!rejectReason) {
//   //       enqueueSnackbar('Please enter a reason', { variant: 'warning' });
//   //       return;
//   //     }

//   //     try {
//   //       await axiosInstance.patch('/company-profiles/document-verification', {
//   //         status: 2,
//   //         documentId: selectedDocumentId,
//   //         reason: rejectReason,
//   //       });

//   //       enqueueSnackbar('Document Rejected', { variant: 'success' });

//   //       setRejectOpen(false);
//   //       setRejectReason('');
//   //       refreshDocuments(); // Refresh instantly
//   //     } catch (err) {
//   //       enqueueSnackbar('Rejection failed', { variant: 'error' });
//   //     }
//   //   };

//   const getColor = () => {
//     if (currentStatus?.code) {
//       return 'warning';
//     }
//     return 'default';
//   };
//   return (
//     <>
//       <TableRow hover selected={selected}>
//         <TableCell sx={{ whiteSpace: 'nowrap' }}>
//           {id || 'N/A'}
//         </TableCell>

//         <TableCell>
//           <Label
//             variant="soft"
//             color={getColor()}
//           >
//             {(!currentStatus || currentStatus?.code === 'credit_rating_approval') ? localStatusMapper?.find((status) => status.code === localStorage.getItem('activeStepId'))?.label : currentStatus?.label}
//           </Label>
//         </TableCell>

//         <TableCell sx={{ whiteSpace: 'nowrap' }}>
//           {createdAt ? new Date(createdAt).toLocaleDateString('en-GB', {
//             day: '2-digit',
//             month: 'short',
//             year: 'numeric',
//           }) : 'N/A'}
//         </TableCell>

//         {/* Actions */}
//         {/* <TableCell align="right">
//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
//             <IconButton
//               color="success"
//               // onClick={() => handleApprove(doc.id)}
//               // disabled={doc.status === 1 || doc.status === 2}
//               // sx={{
//               //   opacity: doc.status === 1 || doc.status === 2 ? 0.4 : 1,
//               //   cursor: doc.status === 1 || doc.status === 2 ? 'not-allowed' : 'pointer',
//               // }}
//             >
//               <Iconify icon="eva:checkmark-circle-2-outline" width={26} />
//             </IconButton>

//             <IconButton
//               color="error"
//               // onClick={() => handleRejectClick(doc.id)}
//               // disabled={doc.status === 1 || doc.status === 2}
//               // sx={{
//               //   opacity: doc.status === 1 || doc.status === 2 ? 0.4 : 1,
//               //   cursor: doc.status === 1 || doc.status === 2 ? 'not-allowed' : 'pointer',
//               // }}
//             >
//               <Iconify icon="eva:close-circle-outline" width={26} />
//             </IconButton>
//           </Box>
//         </TableCell> */}

//       </TableRow>

//        {/* <RejectReasonDialog
//               open={rejectOpen}
//               onClose={() => setRejectOpen(false)}
//               reason={rejectReason}
//               setReason={setRejectReason}
//               onSubmit={handleRejectSubmit}
//             /> */}

//       {/* Popover */}
//       {/* <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 140 }}>
//         <MenuItem
//           onClick={() => {
//             confirm.onTrue();
//             popover.onClose();
//           }}
//           sx={{ color: 'error.main' }}
//         >
//           <Iconify icon="solar:trash-bin-trash-bold" />
//           Delete
//         </MenuItem>

//         <MenuItem
//           onClick={() => {
//             onEditRow();
//             popover.onClose();
//           }}
//         >
//           <Iconify icon="solar:pen-bold" />
//           Edit
//         </MenuItem>
//       </CustomPopover> */}

//       {/* Confirm Delete Dialog */}
//       {/* <ConfirmDialog
//         open={confirm.value}
//         onClose={confirm.onFalse}
//         title="Delete"
//         content={`Are you sure you want to delete ${companyName || ''}?`}
//         action={
//           <Button variant="contained" color="error" onClick={onDeleteRow}>
//             View
//           </Button>
//         }
//       /> */}
//     </>
//   );
// }

// ValuerTableRow.propTypes = {
//   row: PropTypes.object,
//   selected: PropTypes.bool,
//   onViewRow: PropTypes.func,
//   onSelectRow: PropTypes.func,
//   onDeleteRow: PropTypes.func,
// };


import PropTypes from 'prop-types';
import {
  TableRow,
  TableCell,
  Avatar,
  IconButton,
  Tooltip,
  Stack,
  Typography,
  Checkbox,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function ValuerTableRow({ row, selected, onSelectRow, onView, onSendRequest }) {
  const { id, legalEntityName, experience, regulatory, feeStructure, responseTime } = row;
   return (
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onChange={() => onSelectRow(id)} />
        </TableCell> */}
        {/* Avatar + Name */}
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2 }}>{legalEntityName.charAt(0)}</Avatar>
          <Typography variant="body2">{legalEntityName}</Typography>
        </TableCell>
  
        {/* Experience */}
        <TableCell>{experience}</TableCell>
  
        {/* Regulatory */}
        <TableCell>{regulatory}</TableCell>
  
        {/* Fees */}
        <TableCell>{feeStructure}</TableCell>
  
        {/* Response Time */}
        <TableCell>{responseTime}</TableCell>
  
        {/* Actions */}
        <TableCell align="center">
          <Stack direction="row" spacing={1} justifyContent="center">
            <Tooltip title="View">
              <IconButton onClick={onView}>
                <Iconify icon="solar:eye-bold" />
              </IconButton>
            </Tooltip>
  
            {/* <Tooltip title="Send Request">
              <IconButton color="primary" onClick={onSendRequest}>
                <Iconify icon="mdi:email-send" sx={{ color: '#000' }} />
              </IconButton>
            </Tooltip> */}
          </Stack>
        </TableCell>
      </TableRow>
    );
}

ValuerTableRow.propTypes = {
  row: PropTypes.object,
  onView: PropTypes.func,
  onSendRequest: PropTypes.func,
};
