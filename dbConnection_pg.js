const Pool = require('pg').Pool
// const pg = new Pool({
//   user    : 'postgres',
//   host    : 'localhost',
//   database: 'oms',
//   password: 'Palinghebat1',
//   port    : 5432,
// });

const pg = new Pool({
  user    : 'flux_backoffice_user',
  host    : '10.170.3.106',
  database: 'flux_dev_backoffice',
  password: 'H263xstjHFdsvE3C',
  port    : 5432,
});


pg.connect((err)=>{
   if(err) throw err;
    console.log("PG_Connected");
});

module.exports = pg;
