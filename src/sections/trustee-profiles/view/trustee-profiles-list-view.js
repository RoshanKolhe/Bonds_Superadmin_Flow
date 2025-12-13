import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// api
import { RouterLink } from 'src/routes/components';

// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
//

import { useFilterDocumentTypes } from 'src/api/document-type';
import TrusteeProfilesTableRow from '../trustee-profiles-table-row';
import TrusteeProfileTableToolbar from '../trustee-profiles-table-toolbar';
import TrusteeProfileTableFiltersResult from '../trustee-profiles-table-filters-result';
import { useFilterTrusteeProfiles } from 'src/api/trustee-profiles';
import { buildFilter } from 'src/utils/filters';
import { status } from 'nprogress';




// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 0, label: 'Pending', color: 'warning' },
  { value: 1, label: 'Under Review', color: 'info' },
  { value: 2, label: 'Approved', color: 'success' },
  { value: 3, label: 'Rejected', color: 'error' },
];


const TABLE_HEAD = [
  { id: 'legalEntityName', label: 'Trustee Name' },
  { id: 'CIN', label: 'CIN' },
  { id: 'GSTIN', label: 'GSTIN' },
  { id: 'isActive', label: 'Status' },
  { id: 'createdAt', label: 'Created At' },
  { id: '', label: 'Actions' },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

// ----------------------------------------------------------------------

export default function TrusteeProfileListView() {
  const table = useTable();

  const settings = useSettingsContext();
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const confirm = useBoolean();

  const filter = buildFilter({
    page: table.page,
    rowsPerPage: table.rowsPerPage,
    order: table.order,
    orderBy: table.orderBy,
    startDate: filters.startDate,
    endDate: filters.endDate,
    validSortFields: ['legalEntityName', 'CIN', 'GSTIN'],
    searchTextValue: filters.name,
  });

  const filterJson = encodeURIComponent(JSON.stringify(filter));

  const params = {
    filter: filterJson,
    status: filters.status !== 'all' ? filters.status : undefined,
  }

  const { filteredTrusteeProfiles, totalCount, } = useFilterTrusteeProfiles(params);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.trusteeProfiles.details(id));
    },
    [router]
  );
  console.log("filteredTrusteeProfiles", filteredTrusteeProfiles);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.documentdrafting.edit(id));
    },
    [router]
  );




  const denseHeight = table.dense ? 52 : 72;
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!filteredTrusteeProfiles.length && canReset) || !filteredTrusteeProfiles.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    [table]
  );


  const handleDeleteRows = useCallback(() => {
    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: filteredTrusteeProfiles.length,
      totalRowsFiltered: filteredTrusteeProfiles.length,
    });
  }, [filteredTrusteeProfiles.length, table, tableData]);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);


  useEffect(() => {
    if (filteredTrusteeProfiles) {
      setTableData(filteredTrusteeProfiles);
    }
  }, [filteredTrusteeProfiles]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Trustee Profiles', href: paths.dashboard.trusteeProfiles.list },
            { name: 'List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={filters.status === tab.value ? 'filled' : 'soft'}
                    color={tab.color}
                  >
                    {tab.value === 'all' ? totalCount.total : totalCount[tab.value]}
                  </Label>
                }
                iconPosition="end"
              />
            ))}
          </Tabs>


          <TrusteeProfileTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <TrusteeProfileTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={filteredTrusteeProfiles.length}
              statusOptions={STATUS_OPTIONS}   

              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />


            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  showCheckbox={false}
                />

                <TableBody>
                  {filteredTrusteeProfiles.map((row) => (
                    <TrusteeProfilesTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                    />
                  ))}


                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={totalCount}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure want to delete ${table.selected.length} items?`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((emails) =>
      Object.values(emails).some((value) =>
        String(value).toLowerCase().includes(name.toLowerCase())
      )
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((emails) =>
      status === 'active' ? !emails.isDeleted : emails.isDeleted
    );
  }

  return inputData;
}
