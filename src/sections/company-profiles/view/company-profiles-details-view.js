import { addYears, format } from 'date-fns';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//


import CompanyProfileDetails from '../company-profiles-details';
import { useGetCompanyProfile } from 'src/api/company-profiles';

// ----------------------------------------------------------------------

export default function CompanyProfilesDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const { companyProfile } = useGetCompanyProfile(id);
  console.log(companyProfile);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Details', href: paths.dashboard.companyProfiles.root },
          {
            name: companyProfile?.data?.companyName || 'Company Profile'

          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CompanyProfileDetails data={companyProfile} />
    </Container>
  );
}
