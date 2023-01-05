import express from 'express';
import mercadopago from 'mercadopago';

const app = express();

mercadopago.configurations.setAccessToken("ACCESS_TOKEN");

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/process_payment', (req, res) => {
    mercadopago.payment.save(req.body)
        .then(function (response) {
            const { status, status_detail, id } = response.body;
            console.log("response", response)
            res.status(response.status).json({ status, status_detail, id });
        })
        .catch(function (error) {
            console.error(error);
        });
});

app.post('/webhook', (req, res) => {
    console.log("webhook", req.body)
    res.status(200).json({ message: "ok" });
});

const server = app.listen(4000, () => {
    console.log("Server Running..")
});
server.setTimeout(60000 * 2); // 2 minutes