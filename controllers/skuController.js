const db_dev = require('../dbConnection').promise();
const logger = require('../logs');


exports.createSKU = async (req, res, next) => {
    logger.info(req.path);
    logger.info(JSON.stringify(req.body));

    try {

        const organizationId = "SF";
        const dateTime = dateTimeNow();
        const shopId = req.body.shop_id;
        const sku = req.body.sku;
        const name = req.body.name;
        const grossWeight = Number(req.body.detail.gross_weight ?? 0);
        const netWeight = Number(req.body.detail.net_weight ?? 0);
        const tare = Number(req.body.detail.tare ?? 0);
        const cube = Number(req.body.detail.cube ?? 0);
        const price = Number(req.body.detail.price ?? 0);
        const length = Number(req.body.detail.length ?? 0);
        const width = Number(req.body.detail.width ?? 0);
        const high = Number(req.body.detail.high ?? 0);
        const serialNumber = req.body.serial_number;

        if (req.body.jwt.details.map(x => x.customerId).indexOf(shopId) === -1) {
            logger.info("shop_id not found");

            return res.json({
                status: 500,
                message: "failed",
                data: "shop_id not found"
            });
        }

        const cekDuplicate = "select sku From bas_sku where organizationId = ? and customerId  = ? and sku = ? and activeFlag = 'Y'";

        const [duplicate] = await db_dev.execute(cekDuplicate, [organizationId, shopId, sku]);
        if (duplicate.length > 0) {
            logger.info("sku has been registered");

            return res.json({
                status: 500,
                message: "failed",
                data: "sku has been registered"
            });
        }

        try {

            const insertSKU = "INSERT INTO bas_sku (organizationId, customerId, sku, activeFLag, skuDescr1, grossWeight, netWeight, tare, cube, price, skuLength, skuWidth, skuHigh, reOrderQty, shelfLife, shelfLifeFlag, shelfLifeType, shelfLifeAlertDays, inboundLifeDays, outboundLifeDays, hazard_flag, packId, lotId, defaultReceivingUom, defaultShipmentUom, reportUom, defaultHold, rotationId, reserveCode, softAllocationRule, allocationRule, replenishRule, chk_scn_uom, oneStepAllocation, invChgWithShipment, qcRule, copyPackIdToLotAtt12, kitFlag, qtyMin, qtyMax, overReceiving, overRcvPercentage, allowReceiving, allowShipment, breakCs, breakIp, specialMaintenance, firstOp, medicineSpecicalControl, secondSerialNoCatch, printMedicineQcReport, sn_asn_qty, sn_so_qty, scanWhenCasePicking, scanWhenPiecePicking, scanWhenCheck, scanWhenReceive, scanWhenPutaway, scanWhenPack, scanWhenMove, scanWhenQc, serialNoCatch, pickByWeight, freePickGift, templateFlag, qcPoint, scanWhenSort, tolerance, ShelfLifeUOM, lot02Available, addWho, addTime, editWho, editTime) VALUES (?,?,?, 'Y',?,?,?,?,?,?,?,?,?, 0, 0, 'N', 'M', 0, 0, 0, 'N', 'STANDARD', 'STANDARD', 'EA', 'EA', 'EA', 'OK', 'STANDARD', 'IN', 'STANDARD', 'STANDARD', 'REPRULE01', 'EA', 'N', 'N', 'STANDARD', 'N', 'N', 0, 0, 'N', 0, 'Y', 'Y', 'Y', 'Y', 'GENERAL', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N',?, 'N', 'N', 'N', 'NO','N',0,'DAY','NORMAL',?,?,?,?)";
            const insertSKUudf = "INSERT INTO bas_sku_udf (organizationId, customerId, sku, ediSendFlag, ediSendFlag2, ediSendFlag3) VALUES (?,?,?,'N','N','N')";

            await db_dev.beginTransaction();
            await db_dev.execute(insertSKU, [organizationId, shopId, sku, name, grossWeight, netWeight, tare, cube, price, length, width, high, serialNumber, 'EDI', dateTime, 'EDI', dateTime]);
            await db_dev.execute(insertSKUudf, [organizationId, shopId, sku]);
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
                sku
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