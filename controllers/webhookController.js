const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { v1: uuidv1, version: uuidVersion } = require('uuid');
const db_dev = require('../dbConnection').promise();
const logger = require('../logs');

exports.orderCreate = async (req, res, next) => {
    logger.info(req.path);
    logger.info(JSON.stringify(req.body));
    let seqNo = "";

    try {

        const organizationId = "SF";
        const uid = uuidv1();
        const dateTime = dateTimeNow();
        const orderId = req.body.order_id;
        const invoiceRef = req.body.invoice_ref_num;
        const warehouseId = getWarehouseId(req.body.location_name ?? "");
        const paymentDate = req.body.payment_date;
        const deviceType = req.body.device_type;
        const orderSource = req.body.jwt.name;
        const releaseStatus = "Y";
        let orderType = req.body.order_type ?? "";
        const soStatus = '00';
        const shopId = req.body.shop_id;
        const nameCustomer = req.body.customer.name
        const phoneCustomer = req.body.customer.phone;
        const emailCustomer = req.body.customer.email;
        const consigneeId = "VIRTUAL";
        const consigneeName = req.body.recipient.name;
        const consigneeTelp = req.body.recipient.phone;
        const address = req.body.recipient.address.address_full;
        const district = req.body.recipient.address.district;
        const city = req.body.recipient.address.city;
        const province = req.body.recipient.address.province;
        const country = req.body.recipient.address.country;
        const zip = req.body.recipient.address.postal_code;
        const carrierId = req.body.logistic.shipping_id;
        const carrierName = req.body.logistic.shipping_name;
        const carrierService = req.body.logistic.service_type;
        const shippingFee = Number(req.body.logistic.shipping_fee ?? 0);
        const serviceName = req.body.logistic.service_name;
        const awb = req.body.logistic.awb ?? "";
        const notes = req.body.notes;
        const cartonGroup = "A";

        const productCount = req.body.products.length;
        if (productCount === 0) {
            logger.info("provide product");

            return res.json({
                status: 500,
                message: "failed",
                data: "provide product"
            });
        }

        if (warehouseId === "") {
            logger.info("location_name not found");

            return res.json({
                status: 500,
                message: "failed",
                data: "location not found"
            });
        }

        if (req.body.jwt.details.map(x => x.customerId).indexOf(shopId) === -1) {
            logger.info("shop_id not found");

            return res.json({
                status: 500,
                message: "failed",
                data: "shop_id not found"
            });
        }

        const checkCustomer = "SELECT customerId, customerDescr1 customerName, CASE  WHEN udf01 = 'NT' THEN 0 ELSE 1 END tokoCabang  FROM bas_customer where customerType = 'OW' and customerId = ? and activeFLag = 'Y' and udf01 <> 'N'";
        const customer = await db_dev.execute(checkCustomer, [shopId]);
        if (customer.length > 0) {
            customerName = customer[0][0].customerName;
            tokoCabang = customer[0][0].tokoCabang;
        }

        if (orderType === "SO") {
            orderType = tokoCabang == 1 ? "SO" : "CM";
        } else if (orderType === "WD") {
            orderType = tokoCabang == 1 ? "WT" : "N-WT";
        }

        const prod = groupingProduct(req.body.products);
        const totalAmount = req.body.products.map(x => (Number(x.price) * Number(x.quantity))).reduce((total, p) => total + p) + shippingFee;


        try {

            const cekStock = checkStockQuery();
            const cekDuplicate = "select ORDERNO From doc_order_header Where organizationId = ? and warehouseId = ? and soReference1 = ?"
            const cekCurrier = "SELECT customerId currierId, customerDescr1 currierName FROM `bas_customer` where customerType='CA' and customerId = ? and UPPER(customerDescr1) = UPPER(?)";

            const [duplicate] = await db_dev.execute(cekDuplicate, [organizationId, warehouseId, orderId]);
            if (duplicate.length > 0) {
                logger.info("order_id has been registered");

                return res.json({
                    status: 500,
                    message: "failed",
                    data: "order_id has been registered"
                });
            }

            const [carrier] = await db_dev.execute(cekCurrier, [carrierId, carrierName]);
            if (carrier.length === 0) {
                logger.info("logistic/carrier not registered");

                return res.json({
                    status: 500,
                    message: "failed",
                    data: "logistic/carrier not registered"
                });
            }

            for (var i = 0; i < prod.length; i++) {
                const sku = prod[i].sku;
                const qty = Number(prod[i].qty);
                const [stok] = await db_dev.execute(cekStock, [organizationId, warehouseId, shopId, sku]);

                if (stok.length > 0) {
                    if (stok[0].TOTALQTY < qty) {
                        logger.info(sku + " insufficient stock");

                        return res.json({
                            status: 500,
                            message: "failed",
                            data: sku + " insufficient stock"
                        });
                    }
                } else {
                    logger.info("item " + sku + " not available");

                    return res.json({
                        status: 500,
                        message: "failed",
                        data: "item " + sku + " not available"
                    });
                }
            }

            const seqName = "ORDERNO";

            const getSeq = "call SPCOM_GETIDSEQUENCE(?,?,?, @seqNo, @seqCode);";
            await db_dev.execute(getSeq, [organizationId, warehouseId, seqName]);
            const sequence = await db_dev.execute("SELECT @seqNo, @seqCode;");
            if (sequence.length === 0) {
                logger.info("failed generate sequence");

                return res.json({
                    status: 500,
                    message: "failed",
                    data: "failed generate sequence"
                });
            } else {
                seqNo = sequence[0][0]["@seqNo"];

                logger.info("seqNo " + seqNo + " generated");
            }

            const header = "insert into doc_order_header (organizationId,warehouseId,orderNo,orderType,soStatus, orderTime,customerId,soReference1,soReference2,soReference3, releaseStatus ,hedi06,hedi01,issuePartyName,issuePartyTel1,issuePartyEmail, consigneeId, consigneeName,consigneeAddress1,consigneeDistrict,consigneeCity, consigneeProvince,consigneeCountry, consigneeZip,consigneeTel1,carrierId, carrierName, hedi02, Udf03, deliveryNo,cartonGroup, soReference5, noteText, hedi03, addWho, addTime, editWho, editTime) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
            const detail = "insert into doc_order_details (organizationId, warehouseId, orderNo, orderLineNo, customerId, sku,lineStatus,traceId, qtyOrdered, packId, packUom, qtyOrdered_each, rotationId, softAllocationRule, allocationRule, price, grossWeight, netWeight, cubic, noteText, addWho, addTime, editWho, editTime) values(?,?,?,?,?,?,?,'*',?,'STANDARD','EA',?,'STANDARD','STANDARD','STANDARD',?,?,?,?,?,?,?,?,?)"
            const udfHeader = "insert into doc_order_header_udf(organizationId, warehouseId, orderNo) values(?,?,?)"
            const log = "insert into idx_orderstatus_log (organizationId, warehouseId, seqNo, orderNo, orderStatus, changeBy,  changeTime, addWho,addTime, editWho, editTime) values(?,?,?,?,'00',?,?,?,?,?,?)";

            await db_dev.beginTransaction();
            await db_dev.execute(header, [organizationId, warehouseId, seqNo, orderType, soStatus, dateTime, shopId, orderId, invoiceRef, orderSource, releaseStatus, paymentDate, deviceType, nameCustomer, phoneCustomer, emailCustomer, consigneeId, consigneeName, address, district, city, province, country, zip, consigneeTelp, carrierId, carrierName, serviceName, serviceName, invoiceRef, cartonGroup, awb, notes, totalAmount, 'EDI', dateTime, 'EDI', dateTime]);
            await db_dev.execute(udfHeader, [organizationId, warehouseId, seqNo]);
            await db_dev.execute(log, [organizationId, warehouseId, uid, seqNo, 'EDI', dateTime, 'EDI', dateTime, 'EDI', dateTime]);

            for (var i = 0; i < productCount; i++) {
                const sku = req.body.products[i].item_code;
                const name = req.body.products[i].name;
                const notes = req.body.products[i].notes;
                const netWeight = Number(req.body.products[i].net_weight);
                const grossWeight = Number(req.body.products[i].gross_weight);
                const cubic = Number(req.body.products[i].cubic);
                const price = Number(req.body.products[i].price);
                const qty = Number(req.body.products[i].quantity);

                await db_dev.execute(detail, [organizationId, warehouseId, seqNo, i + 1, shopId, sku, soStatus, qty, qty, price, grossWeight, netWeight, cubic, notes, 'EDI', dateTime, 'EDI', dateTime]);

            }
            await db_dev.commit();
        } catch (err) {
            logger.error(err.message + " " + JSON.stringify(err));

            await db_dev.rollback();
            return res.json({
                status: 500,
                message: "failed",
                data: err.message
            });

        }

        logger.info("Shipment order success with no order : " + seqNo);

        return res.json({
            status: 200,
            message: 'success',
            data: {
                order_no: seqNo,
                order_id: orderId
            }
        });

    }
    catch (err) {
        logger.error(err.message + " " + JSON.stringify(err));

        return res.status(500).json({
            status: 500,
            message: "failed",
            data: err.message
        });
    }
}


exports.orderStatus = async (req, res) => {
    logger.info(req.path);

    try {

        const organizationId = "SF";
        const orderNo = req.params.order_no;
        const warehouseId = await getWarehouseIdByOrderCode(orderNo);

        if (warehouseId === "") {
            logger.info("location_name : " + orderNo + " not found");

            return res.json({
                status: 500,
                message: "failed",
                data: "order_no : " + orderNo + " not found"
            });
        }

        const checkOrder = "select doh.customerId, doh.orderNo, doh.soStatus status, ml.codeDescr statusDesc, DATE_FORMAT(doh.EDITTIME,'%Y-%m-%d %H:%i:%s') lastUpdate  From doc_order_header doh join bsm_code_ml ml on doh.soStatus = ml.codeId and ml.organizationId = doh.organizationId and codeType = 'SO_STS' and languageId = 'en' where doh.organizationId = ? and doh.warehouseId = ? and doh.orderNo = ?";
        const [order] = await db_dev.execute(checkOrder, [organizationId, warehouseId, orderNo]);

        if (order.length > 0) {

            if (req.body.jwt.details.map(x => x.customerId).indexOf(order[0].customerId) === -1) {
                logger.info("order_no : " + orderNo + " not found");

                return res.json({
                    status: 500,
                    message: "failed",
                    data: "order_no : " + orderNo + " not found"
                });
            }

            const result = {
                order_no: order[0].orderNo,
                code: order[0].status,
                status: order[0].statusDesc,
                last_update: order[0].lastUpdate
            }

            logger.info("order_no : " + orderNo + " " + JSON.stringify(result));

            return res.json({
                status: 200,
                message: "success",
                data: result
            });
        } else {

            logger.info("order_no : " + orderNo + " not found");

            return res.json({
                status: 500,
                message: "failed",
                data: "order_no : " + orderNo + " not found"
            });
        }
    }
    catch (err) {
        logger.error(err.message + " " + JSON.stringify(err));

        return res.status(500).json({
            status: 500,
            message: "failed",
            data: err.message
        });
    }
}


function getWarehouseId(name) {
    if (name.toUpperCase() == "Pancoran".toUpperCase()) {
        return "TITIPAJA";
    } else if (name.toUpperCase() == "Medan".toUpperCase()) {
        return "TITIPAJA-01";
    } else if (name.toUpperCase() == "Bandung".toUpperCase()) {
        return "TITIPAJA-02";
    } else if (name.toUpperCase() == "Surabaya".toUpperCase()) {
        return "TITIPAJA-03";
    } else if (name.toUpperCase() == "Pluit".toUpperCase()) {
        return "TITIPAJA-05";
    } else if (name.toUpperCase() == "Palembang".toUpperCase()) {
        return "TITIPAJA-06";
    } else {
        return "";
    }
}

function getWarehouseIdByOrderCode(orderNo) {

    const name = orderNo.substring(0, 4);
    if (name.toUpperCase() == "SJK1".toUpperCase()) {
        return "TITIPAJA";
    } else if (name.toUpperCase() == "SMD1".toUpperCase()) {
        return "TITIPAJA-01";
    } else if (name.toUpperCase() == "SBD1".toUpperCase()) {
        return "TITIPAJA-02";
    } else if (name.toUpperCase() == "SSB1".toUpperCase()) {
        return "TITIPAJA-03";
    } else if (name.toUpperCase() == "SJK2".toUpperCase()) {
        return "TITIPAJA-05";
    } else if (name.toUpperCase() == "SPL1".toUpperCase()) {
        return "TITIPAJA-06";
    } else {
        return "";
    }
}


function dateTimeNow() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    const hour = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
    const minute = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
    const second = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds();
    const date = `${year}-${month}-${day}`;
    const time = `${hour}:${minute}:${second}`;
    const dateTime = date + ' ' + time;

    return dateTime;
}


function checkStockQuery() {

    const query = "SELECT  A1.WAREHOUSEID, A1.SKU, B.SKUDESCR1, IFNULL(ROUND(A.QtyOnHold), 0) holdQty, C.CUSTOMERID, C.CUSTOMERDESCR1, "
        + "IFNULL(ROUND(SUM(CASE WHEN D.locationAttribute IN('OK', 'NU') AND C1.lotatt08 = 'N' THEN A.qty - A.QtyAllocated - A.QtyOnHold - A.QtyRPOut - A.QtyMVOut ELSE 0 END)), 0) TOTALQTY "
        + "FROM "
        + "(SELECT  organizationId, warehouseId, toSKU AS sku, fmCustomerId AS customerId FROM act_transaction_log atl WHERE ORGANIZATIONID = ? "
        + "AND  WAREHOUSEID IN(SELECT warehouseid FROM bsm_warehouse WHERE warehouseid = ? AND activeflag = 'Y') "
        + "AND toCustomerId = ? "
        + "AND toSku = ? "
        + "GROUP BY organizationId, warehouseId, toSku) A1 "
        + "LEFT JOIN INV_LOT_LOC_ID A  ON  A.organizationId = A1.organizationId AND A.warehouseId = A1.warehouseId AND A.sku = A1.sku AND A.customerId = A1.customerId "
        + "LEFT JOIN BAS_SKU B ON B.SKU = A1.SKU AND B.CUSTOMERID = A1.CUSTOMERID AND B.ORGANIZATIONID = A1.ORGANIZATIONID "
        + "LEFT JOIN Inv_lot_att C1 ON  C1.lotnum = A.lotnum AND C1.customerid = A1.customerId AND C1.organizationId = A1.organizationId "
        + "LEFT JOIN BAS_CUSTOMER C ON C.CUSTOMERID = A1.CUSTOMERID AND C.CUSTOMERTYPE = 'OW' AND C.ORGANIZATIONID = A1.ORGANIZATIONID "
        + "LEFT JOIN bas_location D ON D.locationid = A.locationId AND D.warehouseId = A1.warehouseId AND D.organizationId = A1.organizationId "
        + "WHERE C.UDF01 = 'NT' AND B.SKU <> 'FULLCARTON' "
        + "GROUP BY A1.ORGANIZATIONID, A1.WAREHOUSEID, A1.SKU, A1.CUSTOMERID, B.SKUDESCR1, C.CUSTOMERDESCR1 ";

    return query;
}

function groupingProduct(products) {
    let pro = Object.values(products.reduce((list, product) => {
        let sku = product.item_code;
        list[sku] = list[sku] || [];
        list[sku].push(product);
        return list;
    }, {}));

    let result = []
    for (var i = 0; i < pro.length; i++) {
        let temp = {};
        temp.sku = pro[i][0].item_code;
        temp.qty = pro[i].map(p => Number(p.quantity)).reduce((total, qty) => total + qty);
        result.push(temp);
    }

    return result;
}