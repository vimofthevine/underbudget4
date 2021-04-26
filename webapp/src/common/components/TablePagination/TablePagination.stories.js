import React from 'react';

import TablePagination from './TablePagination';

export default {
  title: 'common/TablePagination',
  component: TablePagination,
};

const Template = (args) => <TablePagination {...args} />;
Template.args = {
  labelRowsPerPage: 'Rows per page',
};

export const NoRows = Template.bind({});
NoRows.args = {
  ...Template.args,
  count: 0,
};

export const OnePageOfRows = Template.bind({});
OnePageOfRows.args = {
  ...Template.args,
  count: 3,
};

export const FewPagesOfRows = Template.bind({});
FewPagesOfRows.args = {
  ...Template.args,
  count: 40,
};

export const ManyPagesOfRows = Template.bind({});
ManyPagesOfRows.args = {
  ...Template.args,
  count: 100,
};

export const AlternatePageSize = Template.bind({});
AlternatePageSize.args = {
  ...Template.args,
  count: 40,
  defaultSize: 25,
};

export const AlternateLabel = Template.bind({});
AlternateLabel.args = {
  ...Template.args,
  count: 12,
  labelRowsPerPage: 'Things',
};

export const SecondPage = ManyPagesOfRows.bind({});
SecondPage.args = ManyPagesOfRows.args;
SecondPage.parameters = { initialRoute: '?page=2' };

export const ThirdPage = ManyPagesOfRows.bind({});
ThirdPage.args = ManyPagesOfRows.args;
ThirdPage.parameters = { initialRoute: '?page=3&size=25' };
