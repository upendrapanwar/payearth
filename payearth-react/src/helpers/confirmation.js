import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function confirmation(title, msg, process) {
    confirmAlert({
        title: title,
        message: msg,
        buttons: [{
                label: 'Yes',
                onClick: () => process()
            },
            {
                label: 'No'
            }
        ]
    });
}

export { confirmation };