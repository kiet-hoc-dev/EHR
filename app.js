const express = require('express');
const mongoose = require('mongoose');
const { mongoURI } = require('./config');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const loginRouter = require('./routes/loginRoutes');
const brandRouter = require('./routes/brandRoutes');
const hospitalRouter = require('./routes/hospitalRoutes');
const doctorRouter = require('./routes/doctorRoutes');
const patientRouter = require('./routes/patientRoutes');


app.use('/login', loginRouter);
app.use('/brand', brandRouter);
app.use('/hospital', hospitalRouter);
app.use('/doctor', doctorRouter);
app.use('/patient', patientRouter);

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
