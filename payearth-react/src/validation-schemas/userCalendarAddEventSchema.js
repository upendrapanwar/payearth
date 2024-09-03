import * as Yup from 'yup';

export default Yup.object().shape({
    event_title: Yup.string().required("Title is required"),
    meetingDate: Yup.date().required("Meeting date is required"),
    meetingTime: Yup.string().required("Start time is required"),
    description: Yup.string().required("Description is required"),
});


