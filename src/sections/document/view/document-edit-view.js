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

import { useGetDocumentType } from 'src/api/document-type';
import AdminDocumentFormBuilder from '../document-new-edit-form';

// ----------------------------------------------------------------------

export default function DocumentEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { documentType: currentDocument } = useGetDocumentType(id)

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
            name: 'Documents',
            href: paths.dashboard.document.list,
          },
          {
            name: currentDocument?.name,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AdminDocumentFormBuilder currentDocumentWithForm={currentDocument} />
    </Container>
  );
}
