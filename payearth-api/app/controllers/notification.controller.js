const NotificationService = require('../services/notification.service');

const NotificationController = {
    followUser: (socket, { follower, followed }) => {
        if (!follower || !followed) {
            console.error('Invalid data received in follow event:', { follower, followed });
            return;
        }

       // console.log('Follower:', follower);
       // console.log('Followed:', followed);

        NotificationService.sendFollowNotification(socket, followed.id, follower);
    },

    commentUser: (socket, data ) => {
        if (!data) {
            console.error('Invalid data received in comment event:', { data });
            return;
        }
        const Notification = data.notification
       // console.log('notification daata:', Notification);

        NotificationService.sendCommentNotification(socket,Notification);
    },

    liked: (socket, data ) => {
        if (!data) {
            console.error('Invalid data received in liked event:', { data });
            return;
        }
        const Notification = data.notification
        //console.log('liked daata:', Notification);

        NotificationService.sendLikedNotification(socket,Notification);
    },

    reportPost: (socket, data ) => {
        if (!data) {
            console.error('Invalid data received in reportPost event:', { data });
            return;
        }
        const Notification = data.notification
        //console.log('liked daata:', Notification);

        NotificationService.sendReportPostNotification(socket,Notification);
    },

    chatNotification: (socket, data ) => {
        if (!data) {
            console.error('Invalid data received in chatNotification event:', { data });
            return;
        }
        const Notification = data.notification
        //console.log('liked daata:', Notification);

        NotificationService.chatNotification(socket,Notification);
    },

    Meeting_Request: (socket, data ) => {
        if (!data) {
            console.error('Invalid data received in Event_added :', { data });
            return;
        }
        const Notification = data.notification
        //console.log('liked daata:', Notification);

        NotificationService.Meeting_Request(socket,Notification);
    },

    

};

module.exports = NotificationController;