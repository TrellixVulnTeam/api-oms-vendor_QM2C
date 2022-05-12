const jwt    = require('jsonwebtoken');
const conn   = require('../dbConnection').promise();
const crypto = require('crypto');
const db_dev = require('../dbConnection');

const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start)

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}
const start = process.hrtime()
const durationInMilliseconds = getDurationInMilliseconds (start)

exports.getLocation = async (req,res,next) => {
    try{

        // if(
        //     !req.headers.authorization ||
        //     !req.headers.authorization.startsWith('Bearer') ||
        //     !req.headers.authorization.split(' ')[1]
        // ){
        //     return res.status(422).json({
        //         message: "Please provide the token",
        //     });
        // }

        // const theToken   = req.headers.authorization.split(' ')[1];
        // const decoded    = jwt.verify(theToken, 'the-super-strong-secrect');
        
        const [row] = await conn.execute(
            "SELECT organizationId,warehouseId,warehouseDescr,branchId,udf02 as lat_long,address1,province,city,district,zipCode,contact1_tel1,contact1_email from BSM_WAREHOUSE where activeFlag = 'Y'"
        );
        if(row.length > 0){
            return res.json({
                status:200,
                message:'success',
                response_time:durationInMilliseconds.toLocaleString()+" s",
                total_row:row.length,
                data:row
            });
        }

        res.json({
            status:401,
            message:"Order Not Found",
            response_time:durationInMilliseconds.toLocaleString()+" s",
            data:[]
        });
        
    }
    catch(err){
        next(err);
    }
}