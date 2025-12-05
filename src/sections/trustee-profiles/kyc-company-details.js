import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Card,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import { useGetSignatories } from 'src/api/trusteeKyc';

import RejectReasonDialog from './reject-signatory';

export default function KYCSignatories({ trusteeProfile }) {
  const userId = trusteeProfile?.usersId;
  const stepperId = trusteeProfile?.kycApplications?.currentProgress?.[3];

  const { signatories = [], loading, mutate } = useGetSignatories(userId, stepperId);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  // APPROVE DOCUMENT
  const handleApprove = async (documentId) => {
    try {
      await axiosInstance.patch('/trustee-profiles/document-verification', {
        status: 1,
        documentId,
        reason: '',
      });

      enqueueSnackbar('Document Approved', { variant: 'success' });
      mutate(); // Refresh instantly
    } catch (err) {
      enqueueSnackbar('Approval failed', { variant: 'error' });
    }
  };

  // OPEN REJECT POPUP
  const handleRejectClick = (documentId) => {
    setSelectedDocumentId(documentId);
    setRejectOpen(true);
  };

  // SUBMIT REJECTION
  const handleRejectSubmit = async () => {
    if (!rejectReason) {
      enqueueSnackbar('Please enter a reason', { variant: 'warning' });
      return;
    }

    try {
      await axiosInstance.patch('/trustee-profiles/document-verification', {
        status: 0,
        documentId: selectedDocumentId,
        reason: rejectReason,
      });

      enqueueSnackbar('Document Rejected', { variant: 'success' });

      setRejectOpen(false);
      setRejectReason('');
      mutate(); // Refresh instantly
    } catch (err) {
      enqueueSnackbar('Rejection failed', { variant: 'error' });
    }
  };

  return (
    <Container>
      <Card sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>PAN Preview</b>
                </TableCell>
                <TableCell>
                  <b>Board Resolution</b>
                </TableCell>
                <TableCell>
                  <b>SEBI Registration Certificate</b>
                </TableCell>
                <TableCell>
                  <b>GST Certificate</b>
                </TableCell>
                <TableCell>
                  <b>Status</b>
                </TableCell>
                <TableCell align="right">
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {signatories.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.fullName}</TableCell>
                  <TableCell>
                    {row.panCardFile?.fileUrl ? (
                      <Button
                        variant="outlined"
                        onClick={() => window.open(row.panCardFile.fileUrl, '_blank')}
                      >
                        Preview PAN
                      </Button>
                    ) : (
                      'NA'
                    )}
                  </TableCell>

                  {/* BOARD RESOLUTION */}
                  <TableCell>
                    {row.boardResolutionFile?.fileUrl ? (
                      <Button
                        variant="outlined"
                        onClick={() => window.open(row.boardResolutionFile.fileUrl, '_blank')}
                      >
                        Preview BR
                      </Button>
                    ) : (
                      'NA'
                    )}
                  </TableCell>

                  {/* SEBI Certificate */}
                  <TableCell>
                    {row.sebiRegistrationCertificateFile?.fileUrl ? (
                      <Button
                        variant="outlined"
                        onClick={() =>
                          window.open(row.sebiRegistrationCertificateFile.fileUrl, '_blank')
                        }
                      >
                        Preview SEBI
                      </Button>
                    ) : (
                      'NA'
                    )}
                  </TableCell>

                  {/* GST Certificate */}
                  <TableCell>
                    {row.gstCertificateFile?.fileUrl ? (
                      <Button
                        variant="outlined"
                        onClick={() => window.open(row.gstCertificateFile.fileUrl, '_blank')}
                      >
                        Preview GST
                      </Button>
                    ) : (
                      'NA'
                    )}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    {row.status === 1 ? (
                      <span style={{ color: 'green', fontWeight: 600 }}>Approved</span>
                    ) : row.status === 0 ? (
                      <span style={{ color: 'orange', fontWeight: 600 }}>Pending</span>
                    ) : (
                      <span style={{ color: 'red', fontWeight: 600 }}>Rejected</span>
                    )}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      {/* APPROVE */}
                      <IconButton
                        color="success"
                        onClick={() => handleApprove(row.id)}
                        disabled={row.status === 1}
                        sx={{
                          opacity: row.status === 1 ? 0.4 : 1,
                          cursor: row.status === 1 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <Iconify icon="eva:checkmark-circle-2-outline" />
                      </IconButton>

                      {/* REJECT */}
                      <IconButton
                        color="error"
                        disabled={row.status === 1}
                        onClick={() => handleRejectClick(row.id)}
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
      </Card>

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
