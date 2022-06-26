const router = require('express').Router();
const { body } = require('express-validator');
const { register } = require('./controllers/registerController');
const { login } = require('./controllers/loginController');
const { getUser } = require('./controllers/getUserController');
const { register_ktp } = require('./controllers/ktpController');
const {
    liveOnPo,
    liveOnPo1,
    liveOnPoStatus,
    liveOnPoTest,
    liveOnPoStatusTest,
    liveOnPoRetry,
    liveOnPo_manual,
    liveOnPoStatus_manual
} = require('./controllers/liveOnController');
const { getOrder, getDetailOrder, cancleOrder, searchOrder } = require('./controllers/orderController');
const { getItems, getDetailItem, getListItems, createItem, deleteItem, updateItem } = require('./controllers/itemController');
const { getLocation } = require('./controllers/locationController');
const { serviceRates, generateWaybill, requestPickup, requestCancel, tracking } = require('./controllers/anterajaController');
const { webhookChange } = require('./controllers/webhookinternalController');
const { StatusShipped, requestAck, requestNotAck, syncStockJbl, syncUpdateStock } = require('./controllers/jblController');
const { giftCard } = require('./controllers/apiController');
const { acknowledgeOrder, notAcknowledgeOrder, shippedOrder, stockAdjustment, updateStock } = require('./controllers/ptsscController');
const { orderCreate, orderStatus } = require('./controllers/webhookController');
const { createAsn, asnStatus } = require('./controllers/asnController');
const { mdw } = require('./middleware')
const { createSKU } = require('./controllers/skuController');
const { stockBySkuSeller, stockByLocationSeller } = require('./controllers/stockController');
const { generateToken } = require('./controllers/tokopediaController');
const tokopedia = require('./controllers/tokopediaController');
// router.get('/');
router.get('/', function (req, res, next) {
    res.render('home', {})
})


router.post('/register', [
    body('name', "The name must be of minimum 3 characters length").notEmpty().escape().trim().isLength({ min: 3 }),
    body('email', "Invalid email address").notEmpty().escape().trim().isEmail(),
    body('password', "The Password must be of minimum 4 characters length").notEmpty().trim().isLength({ min: 4 }),
], register);

router.post('/login', [
    body('email', "Invalid email address").notEmpty().escape().trim().isEmail(),
    body('password', "The Password must be of minimum 4 characters length").notEmpty().trim().isLength({ min: 4 }),
], login);

router.post('/register_ktp', [
    body('nama', "The name must be of minimum 3 characters length").notEmpty().escape().trim().isLength({ min: 3 }),
    body('nik', "The NIK must be number 16 characters length").notEmpty().trim().isLength({ max: 16 }),
    body('tgl_lahir', "required").notEmpty().trim(),
    body('jenis_kelamin', "required").notEmpty().trim(),
    body('alamat', "required").notEmpty().trim(),
    body('agama', "required").notEmpty().trim(),
    body('status_perkawinan', "required").notEmpty().trim(),
    body('pekerjaan', "required").notEmpty().trim(),
    body('kewarganegaraan', "required").notEmpty().trim(),
    body('masa_berlaku', "required").notEmpty().trim(),
    body('rt_rw', "required").notEmpty().trim(),
    body('kelurahan', "required").notEmpty().trim(),
    body('kecamatan', "required").notEmpty().trim(),
], register_ktp);
router.get('/getuser', getUser);

// Live.On start
router.get('/liveOnPo', liveOnPo);
router.get('/liveOnPo1', liveOnPo1);
router.post('/liveOnPoTest', liveOnPoTest);
router.post('/liveOnStatus', liveOnPoStatus);
router.post('/liveOnPoStatusTest', liveOnPoStatusTest);
router.get('/liveOnPoRetry', liveOnPoRetry);
router.post('/liveOnPo_manual', liveOnPo_manual);
router.post('/liveOnPoStatus_manual', liveOnPoStatus_manual);

// External API 

// api Order
router.post('/api/oms/getOrder', mdw, getOrder);
router.post('/api/oms/getDetailOrder', mdw, getDetailOrder);
router.post('/api/oms/cancleOrder', mdw, cancleOrder);
router.post('/api/oms/getSearchOrder', mdw, searchOrder);

// api Items
router.post('/getItems', getItems);
router.post('/getDetailItem', getDetailItem);
router.post('/api/oms/getItems', getListItems);
router.post('/api/oms/createItem', createItem);
router.put('/api/oms/deleteItem', deleteItem);
router.put('/api/oms/updateItem', updateItem);

// api Location
router.get('/getLocation', getLocation);

// api 3PL

// api anteraja
router.get('/getprices/titipaja/serviceRates', serviceRates);
router.get('/getprices/titipaja/generateWaybill', generateWaybill);
router.get('/getprices/titipaja/requestPickup', requestPickup);
router.post('/getprices/titipaja/requestCancel', requestCancel);
router.post('/getprices/titipaja/tracking', tracking);

// webhook tabel user
router.get('/webhook/pentaho/', webhookChange);

// module JBL
router.get('/status/Jbl/StatusShipped', StatusShipped);
router.get('/ack/Jbl/requestAck', requestAck);
router.get('/ack/Jbl/requestNotAck', requestNotAck);
router.get('/stock/Jbl/syncStockJbl', syncStockJbl);
router.post('/stock/Jbl/syncUpdateStock', syncUpdateStock);

//api order pts.sc
router.post('/ptssc/order/:orderNo/ack', mdw, acknowledgeOrder);
router.post('/ptssc/order/:orderNo/nack', mdw, notAcknowledgeOrder);
router.post('/ptssc/order/shipped', mdw, shippedOrder);
router.post('/ptssc/stock/stockadjust', mdw, stockAdjustment);
router.post('/ptssc/stock/updatestock', mdw, updateStock);

//api order
router.post('/order/create', mdw, orderCreate);
router.get('/order/status/:order_no', mdw, orderStatus);

//api asn
router.post('/asn/create', mdw, createAsn);
router.get('/asn/status/:asn_no', mdw, asnStatus);

//api sku
router.post('/sku/create', mdw, createSKU);

//api stock
router.get('/stock/viewbyskuseller', mdw, stockBySkuSeller);
router.get('/stock/viewbylocationseller', mdw, stockByLocationSeller);


//api internal
router.post('/api/internal/giftCard', giftCard);

// MP
router.get('/api/marketplace/tokopedia/generateToken', tokopedia.generateToken);
router.get('/api/marketplace/tokopedia/test', tokopedia.test);
router.get('/api/marketplace/tokopedia/getOrder', tokopedia.getOrder);
router.get('/api/marketplace/tokopedia/shopInfo', tokopedia.shopInfo);
router.get('/api/marketplace/tokopedia/getProduct', tokopedia.getProduct);

module.exports = router;