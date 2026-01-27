import { addYears, format } from 'date-fns';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//


import CompanyProfileDetails from '../company-profiles-details';
import { useGetCompanyProfile } from 'src/api/company-profiles';
import { useCallback, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import CompanyDocumentDetails from '../company-document-details';
import CompanyBankPage from '../company-bank-page';
import CompanySignatories from '../company-signatories';
import { useSearchParams } from 'react-router-dom';
import AddressNewForm from '../company-address-details';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'basic', label: 'Company Basic Info' },
  { value: 'address', label: 'Address' },
  { value: 'details', label: 'Company Documents' },
  { value: 'bank', label: 'Bank Details' },
  { value: 'signatories', label: 'Signatories' },
];

export default function CompanyProfilesDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const router = useRouter();
  const { companyProfile } = useGetCompanyProfile(id);
  console.log(companyProfile);

  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const [currentTab, setCurrentTab] = useState(tab || 'basic');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
    router.push({
      search: `?tab=${newValue}`
    });
  }, []);

  const activeTab = TABS.find((t) => t.value === currentTab);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={activeTab?.label || 'Company Profile'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Company Profile', href: paths.dashboard.companyProfiles.root },
          {
            name: companyProfile?.data?.companyName || 'Company Profile'

          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
      {currentTab === 'basic' && <CompanyProfileDetails data={companyProfile} />}

      {currentTab === 'address' && <AddressNewForm data={companyProfile} />}

      {currentTab === 'details' && <CompanyDocumentDetails companyProfile={companyProfile} />}

      {currentTab === 'bank' && <CompanyBankPage companyProfile={companyProfile} />}
      {/* {currentTab === 'bank' && <TrusteeBankPage companyPrifle={companyPrifle} />} */}

      {currentTab === 'signatories' && <CompanySignatories companyProfile={companyProfile} />}

      {/* <CompanyProfileDetails data={companyProfile} /> */}
    </Container>
  );
}
