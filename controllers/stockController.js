const db_dev = require('../dbConnection').promise();
const logger = require('../logs');


exports.stockBySkuSeller = async (req, res) => {
    logger.info(req.path);
    logger.info(JSON.stringify(req.body));

    try {

        const organizationId = "SF";
        const sku = req.body.sku ?? "";
        const shopId = req.body.shop_id ?? "";

        if (req.body.jwt.details.map(x => x.customerId).indexOf(shopId) === -1) {
            logger.info("shop_id not found");

            return res.json({
                status: 500,
                message: "failed",
                data: "shop_id not found"
            });
        }

        const checkStok = checkStockQuery();
        const [stok] = await db_dev.execute(checkStok, [organizationId, shopId, sku]);

        if (stok.length == 0) {
            return res.json({
                status: 200,
                message: 'success',
                data: 'sku : ' + sku + ' not found'
            });

        } else {

            return res.json({
                status: 200,
                message: 'success',
                data: stok
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

exports.stockByLocationSeller = async (req, res) => {
    logger.info(req.path);
    logger.info(JSON.stringify(req.body));

    try {

        const organizationId = "SF";
        const location_name = req.body.location_name ?? "";
        const shopId = req.body.shop_id ?? "";

        if (req.body.jwt.details.map(x => x.customerId).indexOf(shopId) === -1) {
            logger.info("shop_id not found");

            return res.json({
                status: 500,
                message: "failed",
                data: "shop_id not found"
            });
        }

        const checkStok = checkStockByLocationQuery();
        const [stok] = await db_dev.execute(checkStok, [organizationId, shopId, location_name]);

        if (stok.length == 0) {
            return res.json({
                status: 200,
                message: 'success',
                data: 'data not found'
            });

        } else {
            return res.json({
                status: 200,
                message: 'success',
                data: stok
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



function checkStockQuery() {

    //const query = "SELECT  A1.WAREHOUSEID, A1.SKU, B.SKUDESCR1, IFNULL(ROUND(A.QtyOnHold), 0) holdQty, C.CUSTOMERID, C.CUSTOMERDESCR1, "
    //    + "IFNULL(ROUND(SUM(CASE WHEN D.locationAttribute IN('OK', 'NU') AND C1.lotatt08 = 'N' THEN A.qty - A.QtyAllocated - A.QtyOnHold - A.QtyRPOut - A.QtyMVOut ELSE 0 END)), 0) TOTALQTY "
    //    + "FROM "
    //    + "(SELECT  organizationId, warehouseId, toSKU AS sku, fmCustomerId AS customerId FROM act_transaction_log atl WHERE ORGANIZATIONID = ? "
    //    + "AND toCustomerId = ? "
    //    + "AND toSku = ? "
    //    + "GROUP BY organizationId, warehouseId, toSku) A1 "
    //    + "LEFT JOIN INV_LOT_LOC_ID A  ON  A.organizationId = A1.organizationId AND A.warehouseId = A1.warehouseId AND A.sku = A1.sku AND A.customerId = A1.customerId "
    //    + "LEFT JOIN BAS_SKU B ON B.SKU = A1.SKU AND B.CUSTOMERID = A1.CUSTOMERID AND B.ORGANIZATIONID = A1.ORGANIZATIONID "
    //    + "LEFT JOIN Inv_lot_att C1 ON  C1.lotnum = A.lotnum AND C1.customerid = A1.customerId AND C1.organizationId = A1.organizationId "
    //    + "LEFT JOIN BAS_CUSTOMER C ON C.CUSTOMERID = A1.CUSTOMERID AND C.CUSTOMERTYPE = 'OW' AND C.ORGANIZATIONID = A1.ORGANIZATIONID "
    //    + "LEFT JOIN bas_location D ON D.locationid = A.locationId AND D.warehouseId = A1.warehouseId AND D.organizationId = A1.organizationId "
    //    + "WHERE C.UDF01 = 'NT' AND B.SKU <> 'FULLCARTON' "
    //    + "GROUP BY A1.ORGANIZATIONID, A1.WAREHOUSEID, A1.SKU, A1.CUSTOMERID, B.SKUDESCR1, C.CUSTOMERDESCR1 ";


    const query = "select bw.warehouseDescr location_name , lot.sku, bs.SKUDESCR1 name, lot.customerId shop_id, CAST(IFNULL(ROUND(lot.QtyOnHold), 0) AS UNSIGNED) quantity_hold, \
    CAST(IFNULL(ROUND(SUM(CASE WHEN bl.locationAttribute IN('OK', 'NU') AND att.lotatt08 = 'N' THEN lot.qty - lot.QtyAllocated - lot.QtyOnHold - lot.QtyRPOut - lot.QtyMVOut ELSE 0 END)), 0) AS UNSIGNED) quantity \
    From bas_sku bs \
    LEFT JOIN bas_customer bc on bc.customerId = bs.customerId and bc.CustomerType = 'OW' and bc.organizationId = bs.organizationId \
    LEFT JOIN inv_lot_loc_id lot on bs.sku = lot.sku and bs.customerId = lot.customerId and bs.organizationId = lot.organizationId \
    LEFT JOIN Inv_lot_att att on att.lotnum = lot.lotnum and att.customerid = lot.customerId and att.organizationId = lot.organizationId \
    LEFT JOIN bas_location bl on bl.locationid = lot.locationId and bl.warehouseId = lot.warehouseId and bl.organizationId = lot.organizationId \
    LEFT JOIN bsm_warehouse bw on bw.warehouseId = lot.warehouseId and bw.activeFlag = 'Y' and bw.organizationId = bs.organizationId \
    where bs.organizationId = ? and bs.customerId = ? and  bs.sku = ? and bc.udf01 = 'NT' AND bs.SKU <> 'FULLCARTON'  and bs.activeFlag = 'Y' \
    group by lot.warehouseId, lot.sku, lot.customerId";

    return query;
}

function checkStockByLocationQuery() {

    const query = "select bw.warehouseDescr location_name , lot.sku, bs.SKUDESCR1 name, lot.customerId shop_id, CAST(IFNULL(ROUND(lot.QtyOnHold), 0) AS UNSIGNED) quantity_hold, \
    CAST(IFNULL(ROUND(SUM(CASE WHEN bl.locationAttribute IN('OK', 'NU') AND att.lotatt08 = 'N' THEN lot.qty - lot.QtyAllocated - lot.QtyOnHold - lot.QtyRPOut - lot.QtyMVOut ELSE 0 END)), 0) AS UNSIGNED) quantity \
    From bas_sku bs \
    LEFT JOIN bas_customer bc on bc.customerId = bs.customerId and bc.CustomerType = 'OW' and bc.organizationId = bs.organizationId \
    LEFT JOIN inv_lot_loc_id lot on bs.sku = lot.sku and bs.customerId = lot.customerId and bs.organizationId = lot.organizationId \
    LEFT JOIN Inv_lot_att att on att.lotnum = lot.lotnum and att.customerid = lot.customerId and att.organizationId = lot.organizationId \
    LEFT JOIN bas_location bl on bl.locationid = lot.locationId and bl.warehouseId = lot.warehouseId and bl.organizationId = lot.organizationId \
    LEFT JOIN bsm_warehouse bw on bw.warehouseId = lot.warehouseId and bw.activeFlag = 'Y' and bw.organizationId = bs.organizationId \
    where bs.organizationId = ? and bs.customerId = ? and upper(bw.warehouseDescr) = upper(?) and bc.udf01 = 'NT' AND bs.SKU <> 'FULLCARTON'  and bs.activeFlag = 'Y' \
    group by lot.warehouseId, lot.sku, lot.customerId";

    return query;
}