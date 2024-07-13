import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/inventory/inventorySlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditInventory = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    product_name: '',

    quantity_available: '',

    quantity_reserved: '',

    quantity_returned: '',

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { inventory } = useAppSelector((state) => state.inventory);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { inventoryId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: inventoryId }));
  }, [inventoryId]);

  useEffect(() => {
    if (typeof inventory === 'object') {
      setInitialValues(inventory);
    }
  }, [inventory]);

  useEffect(() => {
    if (typeof inventory === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = inventory[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [inventory]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: inventoryId, data }));
    await router.push('/inventory/inventory-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit inventory')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit inventory'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='ProductName'>
                <Field name='product_name' placeholder='ProductName' />
              </FormField>

              <FormField label='QuantityAvailable'>
                <Field
                  type='number'
                  name='quantity_available'
                  placeholder='QuantityAvailable'
                />
              </FormField>

              <FormField label='QuantityReserved'>
                <Field
                  type='number'
                  name='quantity_reserved'
                  placeholder='QuantityReserved'
                />
              </FormField>

              <FormField label='QuantityReturned'>
                <Field
                  type='number'
                  name='quantity_returned'
                  placeholder='QuantityReturned'
                />
              </FormField>

              {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
                <FormField label='organization' labelFor='organization'>
                  <Field
                    name='organization'
                    id='organization'
                    component={SelectField}
                    options={initialValues.organization}
                    itemRef={'organizations'}
                    showField={'name'}
                  ></Field>
                </FormField>
              )}

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/inventory/inventory-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditInventory.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_INVENTORY'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditInventory;
