const app = require('./app');

app.listen(process.env.PORT, () => {
  console.info(`Listening at http://localhost:${process.env.PORT}`);
  console.info('Environment:', process.env.NODE_ENV);
});
