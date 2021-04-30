const db = require("../utils/db")

const table = "bill"

exports.create = async (data) => {
    const fields = Object.keys(data)
    const values = Object.values(data)

    const dataSet = fields.join(" = ?,") + " = ?"

    let error = null
    let result = null

    try {
        [ result ] = await db.query(`INSERT INTO ${table} SET ${dataSet}`, values)
    } catch (e) {
        error = e
    }

    return [ result, error ]
}

exports.read = async (id) => {
    let error = null
    let result = null

    try {
        [ result ] = await db.query(`SELECT * FROM ${table} WHERE id = ? LIMIT 1`, [id])
    } catch (e) {
        error = e
    }

    let resultItem = result.length > 0 ? result[0] : null

    return [
        resultItem,
        error
    ]
}

exports.update = async (id, data) => {
    const fields = Object.keys(data)
    const values = Object.values(data)

    const dataSet = fields.join(" = ?,") + " = ?"

    try {
        await db.query(`UPDATE ${table} SET ${dataSet} WHERE id = ?`, [...values, id])
    } catch (error) {
        return error
    }

    return null
}

exports.delete = async (id) => {
    try {
        await db.query(`DELETE FROM ${table} WHERE id = ?`, [id])
    } catch (error) {
        return error
    }

    return null
}

exports.find = async (q, _start = 0, _limit = 30) => {
    _start = parseInt(_start, 10)
    _limit = parseInt(_limit, 10)
    
    let result = []
    let error = null
    let total = 0

    if(q) {
        q = db.escape(`%${q}%`)
    } else {
        q = "''"
    }

    let whereFilter = `WHERE name LIKE ${q}`
    
    try {        
        let [ totalResult ] = await db.query(`SELECT count(*) as total FROM ${table} ${whereFilter}`)

        let [ queryResult ] = await db.query(`SELECT
                                            id,
                                            name,
                                            price,
                                            due_date,
                                            paid_date,
                                            days_late,
                                            fee_per_day,
                                            fee,
                                            fee_total,
                                            paid_price
                                        FROM ${table}
                                        ${whereFilter}
                                        LIMIT ${_start}, ${_limit}`)


        result = queryResult
        total = totalResult ? totalResult[0].total : 0
    } catch (e) {
        error = e
    }

    return [ result, total, error ]
}