import { useState, useCallback } from 'react';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useParams } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';

import { useGetTrusteeProfile } from 'src/api/trustee-profiles';

// ⬇️ Your 4 pages
import KYCBasicInfo from '../kyc-basic-info';
import KYCCompanyDetails from '../kyc-company-details';
import KYCBankDetails from '../kyc-bank-details';
import KYCSignatories from '../kyc-signatories';
import CompanyBankPage from '../bank-detail-view';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'basic', label: 'Company Basic Info' },
  { value: 'details', label: 'Company Details' },
  { value: 'bank', label: 'Bank Details' },
  { value: 'signatories', label: 'Signatories' },
];

// ----------------------------------------------------------------------

export default function TrusteeProfilesDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const { trusteeProfile } = useGetTrusteeProfile(id);

  const [currentTab, setCurrentTab] = useState('basic');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Details', href: paths.dashboard.trusteeProfiles.root },
          { name: trusteeProfile?.data?.legalEntityName || 'Trustee Profile' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* ------------ Tabs UI ------------ */}
      <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>

      {/* ------------ TAB CONTENT ------------ */}
      {currentTab === 'basic' && <KYCBasicInfo trusteeProfile={trusteeProfile.data} />}

      {currentTab === 'details' && <KYCCompanyDetails trusteeProfile={trusteeProfile.data} />}

      {/* {currentTab === 'bank' && <KYCBankDetails trusteeProfile={trusteeProfile.data} />} */}
      {currentTab === 'bank' && <CompanyBankPage trusteeProfile={trusteeProfile.data} />}

      {currentTab === 'signatories' && <KYCSignatories trusteeProfile={trusteeProfile.data} />}
    </Container>
  );
}
