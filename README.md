# QuiteClear

- First create database in local

**create models and migration file using cmd**

```
npx sequelize-cli model:generate --name <table_name> --attributes <column>:<Type>,id:Integer,name:string,value:Double,
```

**Create new migration to modify any existing migration**

```
npx sequelize-cli migration:create --name modify_users_add_new_fields
```

**for migration**

- to create tables in database

```
npm run migration
```

**seed data in database**

- to seed data in database

```
npm run seed
```

Run server with nodemon

```
npm run dev
```

Generate new seeder

```
npx sequelize-cli seed:generate --name <name>
```

Download sonarqube image

```
docker-compose -f docker-compose.sonar.yml up -d
```

Run Sonarqube check

```
npm run sonar
```

You need to run the following command to start the SonarQube on port 9000.

```
docker run -d
     --name sonarqube
     -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
     -p 9000:9000 sonarqube:latest
```
