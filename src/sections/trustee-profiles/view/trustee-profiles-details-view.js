import { useState, useCallback } from 'react';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useParams, useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';

import { useGetTrusteeProfile } from 'src/api/trustee-profiles';

// ⬇️ Your 4 pages
import KYCBasicInfo from '../kyc-basic-info';
import KYCCompanyDetails from '../kyc-company-details';
import KYCSignatories from '../kyc-signatories';
import TrusteeBankPage from '../bank-detail-view';
import TrusteeProfileDetails from '../trustee-profiles-details';
import { useSearchParams } from 'react-router-dom';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'basic', label: 'Basic Info' },
  { value: 'details', label: 'Documents' },
  { value: 'bank', label: 'Bank Details' },
  { value: 'signatories', label: 'Signatories' },
];

// ----------------------------------------------------------------------

export default function TrusteeProfilesDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const { trusteeProfile } = useGetTrusteeProfile(id);
  const router = useRouter();

  const [searchParams]= useSearchParams();

  const tab = searchParams.get('tab');

  const [currentTab, setCurrentTab] = useState(tab || 'basic' ) ;

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
    router.push({search : '?tab='+newValue});
  }, []);
  
 const activeTab = TABS.find((t)=> t.value === currentTab)
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
      heading={activeTab?.label}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Trustee Profile', href: paths.dashboard.trusteeProfiles.root },
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
      {currentTab === 'basic' && <TrusteeProfileDetails data={trusteeProfile.data} />}

      {currentTab === 'details' && <KYCCompanyDetails trusteeProfile={trusteeProfile.data} />}

      {/* {currentTab === 'bank' && <KYCBankDetails trusteeProfile={trusteeProfile.data} />} */}
      {currentTab === 'bank' && <TrusteeBankPage trusteeProfile={trusteeProfile.data} />}

      {currentTab === 'signatories' && <KYCSignatories trusteeProfile={trusteeProfile.data} />}
    </Container>
  );
}
