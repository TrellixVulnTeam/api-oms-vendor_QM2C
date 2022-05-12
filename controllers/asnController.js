const db_dev = require('../dbConnection').promise();
const logger = require('../logs');


exports.createAsn = async (req, res, next) => {
    logger.info(req.path);
    logger.info(JSON.stringify(req.body));

    let seqNo = "";

    try {

        const organizationId = "SF";
        const dateTime = dateTimeNow();
        const warehouseId = getWarehouseId(req.body.location_name ?? "");
        const asnReference1 = req.body.asn_id;
        const asnReference2 = req.body.asn_ref_num;
        let asnType = "";
        const asnStatus = "00";
        const releaseStatus = "N";
        const expectedArriveTime1 = req.body.expected_arrive_time;
        const expectedArriveTime2 = req.body.expected_arrive_time;
        const shopId = req.body.shop_id;
        let customerName = "";
        let tokoCabang = "";
        const receivingLocation = getStagingWarehouse(warehouseId);
        const orderSource = req.body.jwt.name;

        let totalCubic = 0;
        let totalGrossWeight = 0;
        let totalNetWeight = 0;
        let totalPrice = 0;

        const productCount = req.body.products.length;
        if (productCount === 0) {
            logger.info("provide product");

            return res.json({
                status: 500,
                message: "failed",
                data: "provide product"
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

        if (warehouseId === "") {
            logger.info("location_name not found");

            return res.json({
                status: 500,
                message: "failed",
                data: "location not found"
            });
        }

        const cekDuplicate = "select asnNo From doc_asn_header Where organizationId = ? and warehouseId = ? and asnReference1 = ?"

        const [duplicate] = await db_dev.execute(cekDuplicate, [organizationId, warehouseId, asnReference1]);
        if (duplicate.length > 0) {
            logger.info("asn_id has been registered");

            return res.json({
                status: 500,
                message: "failed",
                data: "asn_id has been registered"
            });
        }

        const checkCustomer = "SELECT customerId, customerDescr1 customerName, CASE  WHEN udf01 = 'NT' THEN 0 ELSE 1 END tokoCabang  FROM bas_customer where customerType = 'OW' and customerId = ? and activeFLag = 'Y' and udf01 <> 'N'";
        const customer = await db_dev.execute(checkCustomer, [shopId]);
        if (customer.length > 0) {
            customerName = customer[0][0].customerName;
            tokoCabang = customer[0][0].tokoCabang;
        }

        asnType = tokoCabang == 1 ? "CM" : "N-CM";

        try {

            const seqName = "ASNNO";

            const getSeq = "call SPCOM_GETIDSEQUENCE(?,?,?, @seqNo, @seqCode);";
            await db_dev.execute(getSeq, [organizationId, warehouseId, seqName]);
            const sequence = await db_dev.execute("SELECT @seqNo, @seqCode;");
            if (sequence.length === 0) {
                return res.json({
                    status: 500,
                    message: "failed",
                    data: "failed generate sequence"
                });
            } else {
                seqNo = sequence[0][0]["@seqNo"];
            }


            const header = "INSERT INTO doc_asn_header (organizationId, warehouseId, asnNo, asnType, asnStatus, customerId, asnCreationTime, expectedArriveTime1,expectedArriveTime2, asnReference1, asnReference2, asnReference3, supplierId, supplierName, releaseStatus, addWho, addTime, editWho, editTime) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            const udfHeader = "INSERT INTO doc_asn_header_udf(organizationId, warehouseId, asnNo) VALUES(?,?,?)";
            const details = "INSERT INTO doc_asn_details (organizationId, warehouseId, asnNo, asnLineNo, customerId, sku, skuDescr, lineStatus, expectedQty, expectedQty_Each, packId, packUom, holdRejectCode, holdRejectReason, productStatus, productStatus_Descr, receivingLocation,totalCubic, totalGrossWeight, totalNetWeight, totalPrice, addWho, addTime, editWho, editTime) values(?,?,?,?,?,?,?,?,?,?, 'STANDARD', 'EA', 'OK', 'Normal', 'OK', 'Normal',?,?,?,?,?,?,?,?,?)";
            const udfDetails = "INSERT INTO doc_asn_details_udf(organizationId, warehouseId, asnNo, asnlineNo) VALUES(?,?,?,?)";
            const checkSKU = "select sku, skuDescr1, grossWeight, netWeight, tare, cube, price From bas_sku where organizationId = 'SF' and customerId = ? and sku = ? and activeFLag = 'Y'";

            await db_dev.beginTransaction();
            await db_dev.execute(header, [organizationId, warehouseId, seqNo, asnType, asnStatus, shopId, dateTime, expectedArriveTime1, expectedArriveTime2, asnReference1, asnReference2, orderSource, shopId, customerName, releaseStatus, 'EDI', dateTime, 'EDI', dateTime]);
            await db_dev.execute(udfHeader, [organizationId, warehouseId, seqNo]);

            for (var i = 0; i < productCount; i++) {
                const sku = req.body.products[i].item_code;
                const skuDesc = req.body.products[i].name;
                const qty = req.body.products[i].quantity;


                const skus = await db_dev.execute(checkSKU, [shopId, sku]);
                if (skus.length === 0) {
                    await db_dev.rollback();

                    logger.info("sku " + sku + " not registered");

                    return res.json({
                        status: 500,
                        message: "failed",
                        data: "sku " + sku + " not registered"
                    });
                } else {

                    totalCubic = Number(skus[0][0].cube) * qty;
                    totalGrossWeight = Number(skus[0][0].grossWeight) * qty;
                    totalNetWeight = Number(skus[0][0].netWeight) * qty;
                    totalPrice = Number(skus[0][0].price) * qty;
                }

                await db_dev.execute(details, [organizationId, warehouseId, seqNo, i + 1, shopId, sku, skuDesc, asnStatus, qty, qty, receivingLocation, totalCubic, totalGrossWeight, totalNetWeight, totalPrice, 'EDI', dateTime, 'EDI', dateTime]);
                await db_dev.execute(udfDetails, [organizationId, warehouseId, seqNo, i + 1]);

            }
            await db_dev.commit();
        } catch (err) {
            await db_dev.rollback();

            logger.error(err.message + " " + JSON.stringify(err));

            return res.json({
                status: 500,
                message: "failed",
                data: err.message
            });

        }

        return res.json({
            status: 200,
            message: 'success',
            data: {
                asn_no: seqNo,
                asn_id: asnReference1
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


exports.asnStatus = async (req, res) => {
    logger.info(req.path);

    try {

        const organizationId = "SF";
        const asnNo = req.params.asn_no;
        const warehouseId = await getWarehouseIdByOrderCode(asnNo);

        if (warehouseId === "") {
            logger.info("location_name : " + asnNo + " not found");

            return res.json({
                status: 500,
                message: "failed",
                data: "asn_no : " + asnNo + " not found"
            });
        }

        const checkASN = "select dah.customerId, dah.asnNo, dah.asnStatus status, ml.codeDescr statusDesc, DATE_FORMAT(dah.EDITTIME,'%Y-%m-%d %H:%i:%s') lastUpdate  From doc_asn_header dah join bsm_code_ml ml on dah.asnStatus = ml.codeId and ml.organizationId = dah.organizationId and codeType = 'ASN_STS' and languageId = 'en' where dah.organizationId = ? and dah.warehouseId = ? and dah.asnNo = ?";
        const [asn] = await db_dev.execute(checkASN, [organizationId, warehouseId, asnNo]);

        if (asn.length > 0) {

            if (req.body.jwt.details.map(x => x.customerId).indexOf(asn[0].customerId) === -1) {
                logger.info("asn_no : " + asnNo + " not found");

                return res.json({
                    status: 500,
                    message: "failed",
                    data: "asn_no : " + asnNo + " not found"
                });
            }

            const result = {
                asn_no: asn[0].asnNo,
                code: asn[0].status,
                status: asn[0].statusDesc,
                last_update: asn[0].lastUpdate
            }

            logger.info("ASN No : " + asnNo + " " + JSON.stringify(result));

            return res.json({
                status: 200,
                message: "success",
                data: result
            });
        } else {

            logger.info("asn_no : " + asnNo + " not found");

            return res.json({
                status: 500,
                message: "failed",
                data: "asn_no : " + asnNo + " not found"
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
    if (name.toUpperCase() == "AJK1".toUpperCase()) {
        return "TITIPAJA";
    } else if (name.toUpperCase() == "AMD1".toUpperCase()) {
        return "TITIPAJA-01";
    } else if (name.toUpperCase() == "ABD1".toUpperCase()) {
        return "TITIPAJA-02";
    } else if (name.toUpperCase() == "ASB1".toUpperCase()) {
        return "TITIPAJA-03";
    } else if (name.toUpperCase() == "AJK2".toUpperCase()) {
        return "TITIPAJA-05";
    } else if (orderNo.substring(0, 5).toUpperCase() == "APL01".toUpperCase()) {
        return "TITIPAJA-06";
    } else {
        return "";
    }
}


function getStagingWarehouse(warehouseId) {
    if (warehouseId === "TITIPAJA") {
        return "STAGEWH01";
    } else if (warehouseId === "TITIPAJA-01") {
        return "STAGE";
    } else if (warehouseId === "TITIPAJA-02") {
        return "STAGEWH01";
    } else if (warehouseId === "TITIPAJA-03") {
        return "STAGEWH01";
    } else if (warehouseId === "TITIPAJA-05") {
        return "STAGEWH05";
    } else if (warehouseId === "TITIPAJA-06") {
        return "STAGEWH01";
    } else {
        return "";
    }
}