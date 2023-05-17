const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 },
    createParentPath: true,
    abortOnLimit: true,
  })
);
app.set('port', 5000);
app.use(cors('dev'));

app.use(require('./routes/location'));
app.use(require('./routes/rekognition'));

app.listen(app.get('port'), () => console.log(`Server listening on port ${app.get('port')}`));
