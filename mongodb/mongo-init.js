print('Start #################################################################');

db = db.getSiblingDB('entitySerivce_db');
db.createUser(
    {
        user: 'entitySerivce_user',
        pwd: '12345',
        roles: [{role: 'readWrite', db: 'api_prod_db'}],
    },
);


db = db.getSiblingDB('trackingService_db');
db.createUser(
    {
        user: 'trackingService_user',
        pwd: '12345',
        roles: [{role: 'readWrite', db: 'api_prod_db'}],
    },
);

print('END #################################################################');