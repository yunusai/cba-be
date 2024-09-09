export class UpdateTransactionStatusDTO {
    constructor(transactionCode, status) {
        this.transactionCode = transactionCode;
        this.status = status;
    }

    static validate(data) {
        if(!data.transactionCode) throw new Error('Transaction code is required');
        if(!['Pending','Done'].includes(data.status)) throw new Error('Invalid status');
    }
}
