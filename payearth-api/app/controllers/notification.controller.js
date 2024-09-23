const NotificationService = require('../services/notification.service');

const NotificationController = {
    followUser: (socket, { follower, followed }) => {
        if (!follower || !followed) {
            console.error('Invalid data received in follow event:', { follower, followed });
            return;
        }

        console.log('Follower:', follower);
        console.log('Followed:', followed);

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
            console.error('Invalid data received in comment event:', { data });
            return;
        }
        const Notification = data.notification
        //console.log('liked daata:', Notification);

        NotificationService.sendLikedNotification(socket,Notification);
    },

};

module.exports = NotificationController;