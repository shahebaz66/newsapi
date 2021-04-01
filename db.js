const mysql = require('mysql2/promise');



async function query(sql, params) {
    console.log(sql, params);

    
    var connection =await mysql.createConnection({
        host: 'freedb.tech',
        user: 'freedbtech_shahebaz',
        password: '123456',
        database: 'freedbtech_mycloudfornews'
    });
    const [results, ] = await connection.execute(sql, params);

  return results;
}

module.exports = {
    query
}