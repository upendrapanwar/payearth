const NotificationService = {
    sendFollowNotification: (socket, followedId, follower) => {
        const notification = {
            message: `${follower.name} started following you.`,
            type: 'follow',
            userID: follower.id,
        };

        socket.in(followedId).emit('receive_notification', notification);
        // console.log(`Notification sent to user with ID ${followedId}`);
    },

    sendCommentNotification: (socket,Notification) => {
        //console.log('notification data-----',Notification);
        const notification = Notification;

        socket.in(notification.receiver.id).emit('receive_notification', notification);
       // console.log(`Notification sent to user with ID ${notification.receiver.id}`);
    },

    sendLikedNotification: (socket,Notification) => {
       // console.log('notification data-----',Notification);
        const notification = Notification;

        socket.in(notification.receiver.id).emit('receive_notification', notification);
       // console.log(`Notification sent to user with ID ${notification.receiver.id}`);
    },

    sendReportPostNotification: (socket,Notification) => {
        //console.log('notification data-----',Notification);
        const notification = Notification;

        socket.in(notification.receiver.id).emit('receive_notification', notification);
       // console.log(`Notification sent to user with ID ${notification.receiver.id}`);
    },

    chatNotification: (socket,Notification) => {
        //console.log('notification data-----',Notification);
        const notification = Notification;

        socket.in(notification.receiver.id).emit('receive_notification', notification);
       // console.log(`Notification sent to user with ID ${notification.receiver.id}`);
    },

};

module.exports = NotificationService;