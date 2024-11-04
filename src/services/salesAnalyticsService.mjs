import db from "../config/database.mjs";

class SalesAnalyticsService {
    static async getOverview(startDate, endDate) {
        try {
            const query = `
                SELECT
    category.id as categoryId,
    category.category,
    SUM(CASE WHEN transactionDetails.transactionStatus = 'Done' THEN transactionDetails.quantity ELSE 0 END) AS totalSold,
    SUM(CASE WHEN transactionDetails.transactionStatus = 'Pending' THEN transactionDetails.quantity ELSE 0 END) AS totalOrder,
    products.productName,
    products.price,
    (products.price * SUM(CASE WHEN transactionDetails.transactionStatus = 'Done' THEN transactionDetails.quantity ELSE 0 END)) as netSales
FROM
    categories AS category
JOIN
    products AS products ON products.categoryId = category.id
JOIN
    transactionDetails AS transactionDetails ON products.id = transactionDetails.productId
WHERE
    transactionDetails.createdAt BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY
    category.id
ORDER BY
    totalSold DESC
LIMIT 5;
            `;

            // Eksekusi query menggunakan sequelize.query
            const results = await db.query(query, {
                replacements: { startDate, endDate },
                type: db.QueryTypes.SELECT
            });

            return results;
        } catch (error) {
            console.error("Error in SalesAnalyticsService:", error);
            throw error;
        }
    }
}

export default SalesAnalyticsService;
