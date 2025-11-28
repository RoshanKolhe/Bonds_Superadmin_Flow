// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// utils
import { useParams } from 'src/routes/hook';
// api

import { useGetDesignation } from 'src/api/designation';

// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import DocumentFields from '../document-new-edit-form';
import { useGetDocumentType } from 'src/api/document-type';


//


// ----------------------------------------------------------------------

export default function DocumentEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;


  const{documentType:currentDocument}= useGetDocumentType(id)
 

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Edit Document',
            href: paths.dashboard.documentdrafting.root,
          },
          // {
          //   name: currentDesignation?.designation,
          // },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DocumentFields currentFields={currentDocument} />
    </Container>
  );
}
