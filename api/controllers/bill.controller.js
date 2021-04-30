var BillModel = require("../models/bill.model")
var Errors = require("../utils/error")
var feeDays = require("../utils/feeDays")

exports.create = async (req, res) => {
    const errors = Errors()
    var data = validDataForm(errors, req.body)
    
    if(errors.Has()) {
        res.status(errors.InvalidParameterCode).send(errors.GetErrors())
        return
    }

    calcFee(data)

    let [ result, error ] = await BillModel.create(data)

    if(!error)
        if(!error)
        [ resultItem, errorItem ] = await BillModel.read(result.insertId)
    
    if(error) {
        console.log(error)
        errors.InternalError("Ocorreu um erro interno")
        res.status(errors.InternalErrorCode).send(errors.GetErrors())
        return
    }
    
    res.status(200).send(resultItem)
}

exports.read = async (req, res) => {
    const errors = Errors()
    let item = await findItem(req.params.id, errors)
    if(errors.Has()) {
        res.status(errors.InvalidParameterCode).send(errors.GetErrors())
        return
    }
    res.status(200).send(item)
}

exports.update = async (req, res) => {
    const errors = Errors()
    let item = await findItem(req.params.id, errors)
    if(errors.Has()) {
        res.status(errors.InvalidParameterCode).send(errors.GetErrors())
        return
    }
    
    var data = validDataForm(errors, req.body)
    
    if(errors.Has()) {
        res.status(errors.InvalidParameterCode).send(errors.GetErrors())
        return
    }

    calcFee(data)

    let updateData = {
        ...item,
        ...data
    }

    delete updateData.id

    let error = await BillModel.update(item.id, updateData)

    if(error) {
        console.log(error)
        errors.InternalError("Ocorreu um erro interno")
        res.status(errors.InternalErrorCode).send(errors.GetErrors())
        return
    }

    res.status(204).send()
}

exports.delete = async (req, res) => {
    const errors = Errors()
    let item = await findItem(req.params.id, errors)

    if(errors.Has()) {
        res.status(errors.GetCode()).send(errors.GetErrors())
        return
    }
    let error = await BillModel.delete(item.id)
    if(error) {
        console.log(error)
        errors.InternalError("Ocorreu um erro interno")
        res.status(errors.GetCode()).send(errors.GetErrors())
        return
    }

    res.status(204).send({})
}

exports.find = async (req, res) => {
    const errors = Errors()
    let { _offset, _limit, q } = req.query
    let [ result, total, error ] = await BillModel.find(q, _offset, _limit)

    _offset = _offset ? parseInt(_offset, 10) : 0
    _limit = _limit ? parseInt(_limit, 10) : 0

    if(error) {
        console.log(error)
        errors.InternalError("Ocorreu um erro interno")
        res.status(errors.InternalErrorCode).send(errors.GetErrors())
        return
    }

    res.status(200).send({
        total,
        offset: _offset,
        limit: _limit,
        result
    })
}

function validDataForm(errors, data) {
    if(!data.name)
        errors.InvalidParameter("name", "Nome não pode ser vazio")

    if(!data.price)
        errors.InvalidParameter("price", "Valor não pode ser vazio")
    else if(typeof data.price !== "number" || data.price <= 0)
        errors.InvalidParameter("price", "Valor deve ser do tipo inteiro e maior que zero")

    if(!data.due_date)
        errors.InvalidParameter("due_date", "Data de vencimento precisa ser informada")

    if(errors.Has())
        return


    if(isNaN(Date.parse(data.due_date)))
        errors.InvalidParameter("due_date", "Formato de data de vencimento é incorreto")

    if(data.paid_date && isNaN(Date.parse(data.paid_date)))
        errors.InvalidParameter("paid_date", "Formato de data de vencimento é incorreto")

    if(errors.Has())
        return

    return data
}

function calcFee(data) {
    data.days_late = null
    data.fee = null
    data.paid_price = null
    data.fee_per_day = null
    data.fee_total = null
    
    if(!data.paid_date) return

    let diffTime = Date.parse(data.paid_date) - Date.parse(data.due_date)
    
    if(diffTime <= 0) {
        data.days_late = 0
        data.fee = 0
        data.fee_per_day = 0
        data.fee_total = 0
        data.paid_price = data.price
    } else {
        data.days_late = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        let { total, fee, feePerDay, feeTotalAmount } = feeDays(data.days_late, data.price)
        data.fee = fee
        data.fee_per_day = feePerDay
        data.paid_price = total
        data.fee_total = feeTotalAmount
    }
}

async function findItem(id, errors) {
    let [ resultItem, error ] = await BillModel.read(id)
    
    if(error) {
        console.log(error)
        errors.InternalError("Ocorreu um erro interno")
        return
    }

    if(!resultItem) {
        errors.NotFound("Item não encontrado")
        return
    }

    return resultItem
}