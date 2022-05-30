## QuiteClear

### Features
- Create and Update User
- Create and Update Admin
- Login and Logout for SuperAdmin, Admin, User
- Listing API for User and Admins
- Authentication (Login/Signup)

### Tech Stack

- Javascript and ES+6
- NodeJS
- ExpressJS
- MySQL
- Sequelize ORM
- NodeMailer
- AWS SES
- Twilio SMS service
- Mailtrap
- SonarQube
- Jest For Testing

### Packages

- express
- mongoose (for managing mongoDB)
- cors
- dotenv (for environment variables)
- nodemon
- bcryptjs (for password hashing)
- jsonwebtoken (for web tokens and sessions)
- joi (for validation)
- multer (for file uploads)
- sequelize (for ORM)
- twilio (for sending SMS)
- sonarqube (for code analysis)
- jest [supertest] (for testing)
---

###First create database locally

***create models and migration file using cmd***

```
npx sequelize-cli model:generate --name <table_name> --attributes <column>:<Type>,id:Integer,name:string,value:Double,
```

***Create new migration to modify any existing migration***

```
npx sequelize-cli migration:create --name modify_users_add_new_fields
```

***For migration***

```
npm run migration
```

***Seed data in database***

```
npm run seed
```

***Run server with nodemon***

```
npm run dev
```

***Generate new seeder***

```
npx sequelize-cli seed:generate --name <name>
```

***Download sonarqube image***

```
sudo docker-compose -f docker-compose.sonar.yml up -d
```

***Run Sonarqube check***

```
npm run sonar
```

- You need to run the following command to start the SonarQube on port 9000.

```
sudo docker run -d
     --name sonarqube
     -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
     -p 9000:9000 sonarqube:latest
```