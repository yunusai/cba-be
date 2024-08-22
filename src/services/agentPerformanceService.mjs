import Agents from '../models/agents.mjs'
import Customers from '../models/customers.mjs'
import TransactionDetails from '../models/transactionDetails.mjs'
import { Op } from 'sequelize'
import moment from 'moment'

export const calculateAgentPerformance = async (agentName,startDate,endDate) => {
    try{
        //Cari agent berdasarkan nama
        const agent = await Agents.findOne({
            where: {
                name: {
                    [Op.iLike]: `%${agentName}%`
                }
            },
            include: [
                {
                    model: Customers,
                    include: [
                        {
                            model: TransactionDetails,
                            where: {
                                createdAt: {
                                    [Op.between]: [startDate, endDate]
                                }
                            }
                        }
                    ]
                }
            ]
        });

        if(!agent){
            throw new Error('Agent not found')
        }
        //Proses data untuk menghitung performa
        const performance = {
            agentId: agent.id,
            agentName: agent.name,
            customers: agent.customers.map(customer => ({
                customerId: customer.id,
                customerName: customer.name,
                transaction: customer.transactionDetails,
                totalTransactions: customer.transactionDetails.length,
                totalSpending: customer.transactionDetails.reduce((sum, trx) => sum + trx.subtotal, 0)
            })),
            totalCustomers: agent.customers.length,
            totalSpending: agent.customers.reduce((sum, customer) =>
                sum + customer.transactionDetails.reduce((sum, trx) => sum + trx.subtotal, 0), 0
            )
        };
        return performance;
    } catch (error) {
        throw new Error('Failed to calculate agent performance: '+error.message)
    }
}
