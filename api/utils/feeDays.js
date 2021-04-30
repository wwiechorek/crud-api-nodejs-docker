module.exports = (days, price) => {
    let fee = 0
    let feePerDay = 0

    if(days <= 3) {
        fee = 2
        feePerDay = .1
    } else if(days <= 5) {
        fee = 3
        feePerDay = .2
    } else {
        fee = 5
        feePerDay = .3
    }

    let feeTotal = fee + (days * feePerDay)
    let feeTotalAmount = (price * feeTotal / 100) 
    let total = price + feeTotalAmount
    
    return {
        total: total,
        fee,
        feePerDay,
        feeTotalAmount
    }
}