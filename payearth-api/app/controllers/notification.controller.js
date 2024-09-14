const NotificationService = require('../services/notification.service');

const NotificationController = {
    followUser: (socket, { follower, followed }) => {
        if (!follower || !followed) {
            console.error('Invalid data received in follow event:', { follower, followed });
            return;
        }

        console.log('Follower:', follower);
        console.log('Followed:', followed);

        // Use the NotificationService to send a notification
        NotificationService.sendFollowNotification(socket, followed.id, follower);
    },
};

module.exports = NotificationController;