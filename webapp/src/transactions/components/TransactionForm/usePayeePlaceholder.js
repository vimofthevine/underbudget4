import { useField } from 'formik';

export default function usePayeePlaceholder() {
  const [{ value }] = useField('type');
  if (value === 'refund') {
    return 'Who issued the refund?';
  }
  if (value === 'income') {
    return 'Who is your employer?';
  }
  if (value === 'expense') {
    return 'Where did this expense occur?';
  }
  return 'Describe this transaction';
}
