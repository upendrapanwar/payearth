const NotificationService = {
    sendFollowNotification: (socket, followedId, follower) => {
        const notification = {
            message: `${follower.name} started following you.`,
            type: 'follow',
            userID: follower.id,
        };

        // Send notification to the followed user
        socket.in(followedId).emit('receive_notification', notification);
        console.log(`Notification sent to user with ID ${followedId}`);
    },
};

module.exports = NotificationService;