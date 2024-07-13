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

import { update, fetch } from '../../stores/work_orders/work_ordersSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditWork_orders = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    order_number: '',

    materials: [],

    labor: [],

    machinery: [],

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { work_orders } = useAppSelector((state) => state.work_orders);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { work_ordersId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: work_ordersId }));
  }, [work_ordersId]);

  useEffect(() => {
    if (typeof work_orders === 'object') {
      setInitialValues(work_orders);
    }
  }, [work_orders]);

  useEffect(() => {
    if (typeof work_orders === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = work_orders[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [work_orders]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: work_ordersId, data }));
    await router.push('/work_orders/work_orders-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit work_orders')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit work_orders'}
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
              <FormField label='OrderNumber'>
                <Field name='order_number' placeholder='OrderNumber' />
              </FormField>

              <FormField label='Materials' labelFor='materials'>
                <Field
                  name='materials'
                  id='materials'
                  component={SelectFieldMany}
                  options={initialValues.materials}
                  itemRef={'raw_materials'}
                  showField={'name'}
                ></Field>
              </FormField>

              <FormField label='Labor' labelFor='labor'>
                <Field
                  name='labor'
                  id='labor'
                  component={SelectFieldMany}
                  options={initialValues.labor}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              <FormField label='Machinery' labelFor='machinery'>
                <Field
                  name='machinery'
                  id='machinery'
                  component={SelectFieldMany}
                  options={initialValues.machinery}
                  itemRef={'machinery'}
                  showField={'name'}
                ></Field>
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
                  onClick={() => router.push('/work_orders/work_orders-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditWork_orders.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_WORK_ORDERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditWork_orders;
