import { action } from '@storybook/addon-actions';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Field, Form, Formik } from 'formik';
import React from 'react';

import setSelectedLedger from '../../utils/setSelectedLedger';
import MoneyInputField from './MoneyInputField';

export default {
  title: 'common/MoneyInputField',
  component: MoneyInputField,
  decorators: [
    (story, { parameters } = {}) => {
      const { currency = 840, delayResponse = 1000 } = parameters;

      setSelectedLedger('2');

      const mockAxios = new MockAdapter(axios, { delayResponse });
      mockAxios.onGet('/api/ledgers/2').reply(200, { currency });

      return story();
    },
  ],
};

const Template = ({ initialValue = 0, ...args }) => (
  <Formik onSubmit={action('submit')} initialValues={{ money: initialValue }}>
    <Form>
      <Field component={MoneyInputField} name='money' {...args} />
      <br />
      <Field name='money' />
      <br />
      <button type='submit'>Submit</button>
    </Form>
  </Formik>
);

export const ZeroValue = Template.bind({});

export const WholeValue = Template.bind({});
WholeValue.args = { initialValue: 200 };

export const FractionalValue = Template.bind({});
FractionalValue.args = { initialValue: 49 };

export const DecimalValue = Template.bind({});
DecimalValue.args = { initialValue: 217 };

export const LargeValue = Template.bind({});
LargeValue.args = { initialValue: 8675309 };

export const NegativeValue = Template.bind({});
NegativeValue.args = { initialValue: -314159 };

export const Euro = Template.bind({});
Euro.args = DecimalValue.args;
Euro.parameters = { currency: 978 };

export const ZeroDigits = Template.bind({});
ZeroDigits.args = { initialValue: 8675309 };
ZeroDigits.parameters = { currency: 152 }; // CLP

export const ThreeDigits = Template.bind({});
ThreeDigits.args = { initialValue: 8675309 };
ThreeDigits.parameters = { currency: '048' }; // BHD

export const FourDigits = Template.bind({});
FourDigits.args = { initialValue: 8675309 };
FourDigits.parameters = { currency: 990 }; // CLF
