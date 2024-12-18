import db from "../config/database.mjs";

class AgentPerformanceService {
    static async getAgentPerformance(startDate, endDate, sortBy = "totalSales", order = "DESC") {
        try {
            // Validasi input sorting
            const validSortFields = [
                "agentId", "agentName", "categoryId", "categoryName",
                "productName", "variationName", "price", "totalSold", "totalOrder", "totalSales"
            ];
            if (!validSortFields.includes(sortBy)) {
                throw new Error(`Invalid sortBy field: ${sortBy}`);
            }

            // Validasi input order
            const validOrders = ["ASC", "DESC"];
            if (!validOrders.includes(order.toUpperCase())) {
                throw new Error(`Invalid order: ${order}`);
            }

            // Query untuk mencari data agent performance
            const query = `
                SELECT
                    agents.id AS agentId,
                    agents.name AS agentName,
                    categories.id AS categoryId,
                    categories.category AS categoryName,
                    products.productName,
                    variations.variationName,
                    variations.price,
                    SUM(CASE WHEN transactionDetails.transactionStatus = 'Paid' THEN transactionDetails.quantity ELSE 0 END) AS totalSold,
                    SUM(CASE WHEN transactionDetails.transactionStatus = 'Pending' THEN transactionDetails.quantity ELSE 0 END) AS totalOrder,
                    (variations.price * SUM(CASE WHEN transactionDetails.transactionStatus = 'Paid' THEN transactionDetails.quantity ELSE 0 END)) AS totalSales,
                    transactionDetails.createdAt
                FROM
                    agents
                JOIN
                    customers ON customers.agentId = agents.id
                JOIN
                    transactionCustomers ON transactionCustomers.customerId = customers.id
                JOIN
                    transactionDetails ON transactionDetails.id = transactionCustomers.transactionId
                JOIN
                    products ON products.id = variations.productId
                JOIN
                    variations ON variations.id = transactionDetails.variationId
                JOIN
                    categories ON categories.id = products.categoryId
                ${startDate && endDate ? "WHERE transactionDetails.createdAt BETWEEN :startDate AND :endDate" : ""}
                GROUP BY
                    categories.id, products.id, variations.id, agents.id
                ORDER BY
                    ${sortBy} ${order.toUpperCase()}
            `;

            // Eksekusi query menggunakan sequelize.query
            const replacements = {};
            if (startDate && endDate) {
                replacements.startDate = startDate;
                replacements.endDate = endDate;
            }

            const results = await db.query(query, {
                replacements,
                type: db.QueryTypes.SELECT,
            });

            return results;
        } catch (error) {
            console.error("Error in AgentPerformanceService:", error);
            throw error;
        }
    }
}

export default AgentPerformanceService;
