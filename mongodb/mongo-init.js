print('Start #################################################################');

db.createUser(
        {
            user: 'entitySerivce_user',
            pwd: '12345',
            roles: [
                {
                    role: "readWrite",
                    db: "entitySerivce_db"
                }
            ]
        }
);


db.createUser(
        {
            user: 'trackingService_user',
            pwd: '12345',
            roles: [
                {
                    role: "readWrite",
                    db: "trackingService_db"
                }
            ]
        }
);

print('END #################################################################');
