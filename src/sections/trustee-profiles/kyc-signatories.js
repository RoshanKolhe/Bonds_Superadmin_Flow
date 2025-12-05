import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Iconify from 'src/components/iconify';
import { useGetSignatories } from 'src/api/trusteeKyc';
import RejectReasonDialog from './reject-signatory';
import axiosInstance from 'src/utils/axios';
import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const StyledSearch = styled(TextField)(({ theme }) => ({
  width: 300,
  '& .MuiOutlinedInput-root': {
    height: 40,
    '& fieldset': {
      borderColor: theme.palette.grey[500],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

// ----------------------------------------------------------------------

export default function KYCSignatories({ trusteeProfile }) {
  const userId = trusteeProfile?.usersId;
  const stepperId = trusteeProfile?.kycApplications?.currentProgress?.[3];

  const [searchTerm, setSearchTerm] = useState('');
  const { signatories, refreshSignatories } = useGetSignatories(userId, stepperId);

  // ---------------- REJECT DIALOG STATES ----------------
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedSignatoryId, setSelectedSignatoryId] = useState(null);

  const handleOpenReject = (signatoryId) => {
    setSelectedSignatoryId(signatoryId);
    setRejectOpen(true);
  };

  const handleRejectSubmit = async () => {
    try {
      if (!selectedSignatoryId) return;

      await axiosInstance.patch('/trustee-profiles/authorize-signatory-verification', {
        status: 2,
        signatoryId: selectedSignatoryId,
        reason: rejectReason,
      });

      enqueueSnackbar('Signatory Rejected', { variant: 'error' });
      setRejectOpen(false);
      setRejectReason('');
      refreshSignatories();
    } catch (err) {
      enqueueSnackbar('Failed to reject signatory', { variant: 'error' });
    }
  };

  // APPROVE handler
  const handleApprove = async (signatoryId) => {
    try {
      await axiosInstance.patch('/trustee-profiles/authorize-signatory-verification', {
        status: 1,
        signatoryId,
        reason: '',
      });
      enqueueSnackbar('Signatory Approved', { variant: 'success' });
      refreshSignatories();
    } catch (err) {
      enqueueSnackbar('Failed to approve', { variant: 'error' });
    }
  };

  // FILTER TABLE
  const filteredRows = signatories.filter((row) =>
    Object.values(row).some(
      (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Container sx={{ position: 'relative'}}>
      <Box
        sx={{
          boxShadow: '0px 0px 12px 0px #00000040',
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: '23px',
        }}
      >
        {/* TOP BAR */}
        <Box
          sx={{
            mb: 5,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography variant="h4">Add Signatories</Typography>

          <StyledSearch
            placeholder="Search signatories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: '100%', sm: 300 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* TABLE */}
        <TableContainer component={Paper} sx={{ mb: 5 }}>
          <Table sx={{ minWidth: 650 }} aria-label="signatories table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>DOB</TableCell>
                <TableCell>PAN</TableCell>
                <TableCell>Board Resolution</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.fullName}</TableCell>
                  <TableCell>{row.designationValue}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>

                  <TableCell>
                    {row.submittedDateOfBirth
                      ? new Date(row.submittedDateOfBirth).toLocaleDateString()
                      : '-'}
                  </TableCell>

                  {/* PAN Preview */}
                  <TableCell>
                    {row.panCardFile?.fileUrl ? (
                      <a
                        href={row.panCardFile.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#1976d2', textDecoration: 'underline' }}
                      >
                        View
                      </a>
                    ) : (
                      '-'
                    )}
                  </TableCell>

                  {/* Board Resolution Preview */}
                  <TableCell>
                    {row.boardResolutionFile?.fileUrl ? (
                      <a
                        href={row.boardResolutionFile.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#1976d2', textDecoration: 'underline' }}
                      >
                        View
                      </a>
                    ) : (
                      '-'
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {row.status === 1 ? (
                      <span style={{ color: 'green', fontWeight: 600 }}>Approved</span>
                    ) : row.status === 2 ? (
                      <span style={{ color: 'red', fontWeight: 600 }}>Rejected</span>
                    ) : (
                      <span style={{ color: 'orange', fontWeight: 600 }}>Under Review</span>
                    )}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: 1.5, // Proper spacing
                      }}
                    >
                      {/* APPROVE BUTTON */}
                      <IconButton
                        color="success"
                        disabled={row.status === 1} // Disable if approved
                        onClick={() => handleApprove(row.id)}
                        sx={{
                          opacity: row.status === 1 ? 0.4 : 1, // Greyed out when disabled
                          cursor: row.status === 1 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <Iconify icon="eva:checkmark-circle-2-outline" />
                      </IconButton>

                      {/* REJECT BUTTON */}
                      <IconButton
                        color="error"
                        disabled={row.status === 1} // Disable if approved
                        onClick={() => handleOpenReject(row.id)}
                        sx={{
                          opacity: row.status === 1 ? 0.4 : 1,
                          cursor: row.status === 1 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <Iconify icon="eva:close-circle-outline" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* REJECT DIALOG */}
      <RejectReasonDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        reason={rejectReason}
        setReason={setRejectReason}
        onSubmit={handleRejectSubmit}
      />
    </Container>
  );
}
