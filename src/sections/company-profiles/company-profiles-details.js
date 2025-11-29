import { Box, Card, Grid, Stack, Typography, Avatar, Divider } from '@mui/material';
import PropTypes from 'prop-types';
import Label from 'src/components/label';

export default function CompanyProfileDetails({ data }) {
  return (
    <Box sx={{ maxWidth: 850, mx: 'auto', mt: 4 }}>
      <Card sx={{ p: 4, borderRadius: 3 }}>

        <Stack direction="row" alignItems="center" spacing={2}>

          {/* Avatar */}
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: '#FFC107',
              color: '#000',
              fontSize: 30,
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {data?.data?.companyName?.charAt(0) || '?'}
          </Avatar>

          <Stack spacing={0.8}>
            <Typography variant="h5" fontWeight={600}>
              {data?.data?.companyName}
            </Typography>

            <Label
              color={data?.data?.isActive ? 'success' : 'error'}
              sx={{ width: 'fit-content', px: 1.5, py: 0.5 }}
            >
              {data?.data?.isActive ? 'Active' : 'Inactive'}
            </Label>
          </Stack>

        </Stack>


        <Divider sx={{ my: 3 }} />

        {/* ------- Details Grid -------- */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
              Email:
            </Typography>
            <Typography sx={{ fontSize: 15 }}>{data?.data?.users?.email || '—'}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
              Contact No:
            </Typography>
            <Typography sx={{ fontSize: 15 }}>{data?.data?.users?.phone || '—'}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
              CIN:
            </Typography>
            <Typography sx={{ fontSize: 15 }}>{data?.data?.CIN || '—'}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
              GSTIN:
            </Typography>
            <Typography sx={{ fontSize: 15 }}>{data?.data?.GSTIN || '—'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
              Date Of Incorporation:
            </Typography>
            <Typography sx={{ fontSize: 15 }}>{data?.data?.dateOfIncorporation || '—'}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
              City Of Incorporation:
            </Typography>
            <Typography sx={{ fontSize: 15 }}>{data?.data?.cityOfIncorporation || '—'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
              State Of Incorporation:
            </Typography>
            <Typography sx={{ fontSize: 15 }}>{data?.data?.stateOfIncorporation || '—'}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
              Country Of Incorporation:
            </Typography>
            <Typography sx={{ fontSize: 15 }}>{data?.data?.countryOfIncorporation || '—'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
              Udyam Registration Number:
            </Typography>
            <Typography sx={{ fontSize: 15 }}>{data?.data?.udyamRegistrationNumber || '—'}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
              Contact No:
            </Typography>
            <Typography sx={{ fontSize: 15 }}>{data?.data?.users?.phone || '—'}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
              Created At:
            </Typography>
            <Typography sx={{ fontSize: 15 }}>
              {data?.data?.createdAt ? new Date(data?.data?.createdAt).toLocaleDateString() : '—'}
            </Typography>
          </Grid>




        </Grid>

        <Divider sx={{ my: 3 }} />

      </Card>
    </Box>
  );
}

CompanyProfileDetails.propTypes = {
  data: PropTypes.object,
};

