import * as Yup from 'yup';

const SupportCallSchema = Yup.object().shape({
    category: Yup.string().required('Category is required'),
    subject: Yup.string().required('Subject is required'),
    priority: Yup.string().required('Priority is required'),
    message: Yup.string().required('Message is required'),
});

export default SupportCallSchema;
