import db from "../config/database.mjs";
import Products from "../models/products.mjs";
import TransactionDetails from "../models/transactionDetails.mjs";
import Variations from "../models/productVariations.mjs";
import Categories from "../models/categories.mjs";
import TransactionCustomers from "../models/transactionCustomers.mjs";
import Customers from "../models/customers.mjs";
import Agents from "../models/agents.mjs";
import sequelize from "sequelize";
import { Op, QueryTypes } from "sequelize";//import op yang diperlukan untuk startDate dan endDate

export const getOverview = async (startDate, endDate) => {
    try {

        const dateRange = {};

        // Filter by date range if provided
        if (startDate && endDate) {
            dateRange.createdAt = {
                [Op.between]: [startDate, endDate],
            };
        }

        // Ambil total sales (total nominal)
        const totalSales = await TransactionDetails.sum('subtotal', {
            where: {
                ...dateRange,
            },
        });

        // Ambil total orders (jumlah transaksi dengan orderStatus = 'Done')
        const totalOrders = await TransactionDetails.count({
            where: {
                ...dateRange,
            },
        });

        // Ambil total product sold
        const productSold = await TransactionDetails.sum('quantity', {
            where: {
                ...dateRange,
            },
        });

        // Ambil total variation sold
        const variationSold = await TransactionDetails.sum('quantity', {
            where: {
                ...dateRange,
            },
        });

        // Top referral leaderboard
        const topReferralQuery = `
            SELECT 
                a.name AS agentName, 
                SUM(td.quantity) AS itemsSold, 
                SUM(td.subtotal) AS netSales
            FROM transactionCustomers AS tc
            JOIN transactionDetails AS td ON tc.transactionId = td.id
            JOIN customers AS c ON tc.customerId = c.id
            JOIN agents AS a ON c.agentId = a.id
            ${startDate && endDate ? `WHERE td.createdAt BETWEEN :startDate AND :endDate` : ''}
            GROUP BY a.name
            ORDER BY itemsSold DESC
            LIMIT 10
        `;

        const topProductQuery = `
            SELECT 
                p.productName, 
                SUM(td.quantity) AS itemsSold, 
                SUM(td.subtotal) AS netSales
            FROM transactionDetails AS td
            JOIN variations AS v ON td.variationId = v.id
            JOIN products AS p ON v.productId = p.id
             ${startDate && endDate ? `WHERE td.createdAt BETWEEN :startDate AND :endDate` : ''}
            GROUP BY p.productName
            ORDER BY itemsSold DESC
            LIMIT 10
        `;

        const [topReferral, topProducts] = await Promise.all([
            db.query(topReferralQuery, { replacements: { startDate, endDate }, type: db.QueryTypes.SELECT }),
            db.query(topProductQuery, { replacements: { startDate, endDate }, type: db.QueryTypes.SELECT }),
        ]);



        return {
            totalSales,
            totalOrders,
            productSold,
            variationSold,
            leaderboard: {
                topReferral,
                topProducts,
            },
        };
    } catch (error) {
        console.error('Error in getOverviewData:', error);
        throw error;
    }
};

export const getByProducts = async (productId, startDate, endDate, sortBy, search, sortOrder) => {
    try {
        // Build date range filter
        const dateRange = {};

        if (startDate && endDate) {
            dateRange.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)], // Convert to Date objects
            };
        }

        // Filter products by productId if provided
        const productFilter = productId ? { id: productId } : {};

        const searchFilter = search
            ? {
                [Op.or]: [
                    { productName: { [Op.like]: `%${search}%` } },
                ],
            }
            : {};

        // Get product details with sorting
        const productDetails = await Products.findAll({
            where: {
                ...productFilter,
                ...searchFilter, // Include search filter for productName
            },
            include: [
                {
                    model: Categories,
                    attributes: ['category'],
                },
                {
                    model: Variations,
                    attributes: ['id', 'variationName'], // Include variationId
                },
            ],
            order: [[sortBy || 'productName', sortOrder || 'ASC']], // Optional sorting
        });

        if (!productDetails.length) {
            return null; // No data found for this product
        }

        const result = [];

        // Loop through each product to calculate total sales, orders, sold, and variations for each one
        for (const product of productDetails) {
            const productId = product.id;

            // Get total sales (total nominal) per product
            const totalSales = await TransactionDetails.sum('subtotal', {
                where: {
                    ...dateRange,
                    variationId: { [Op.in]: await getVariationsByProductId(productId) }, // Get variations of the product
                },
            });

            // Get total orders (jumlah transaksi dengan orderStatus = 'Done') per product
            const totalOrders = await TransactionDetails.count({
                where: {
                    ...dateRange,
                    variationId: { [Op.in]: await getVariationsByProductId(productId) }, // Get variations of the product
                },
            });

            // Get total product sold per product
            const productSold = await TransactionDetails.sum('quantity', {
                where: {
                    ...dateRange,
                    variationId: { [Op.in]: await getVariationsByProductId(productId) }, // Get variations of the product
                },
            });

            // Get total variation sold per product
            const variationSold = await TransactionDetails.sum('quantity', {
                where: {
                    ...dateRange,
                    variationId: { [Op.in]: await getVariationsByProductId(productId) }, // Get variations of the product
                },
            });

            // Push the product data with its calculated values
            result.push({
                id: product.id,
                productName: product.productName,
                itemsSold: productSold,
                totalSales,
                totalOrders,
                category: product.category.category,
                variationSold,
            });
        }

        // Return the data
        return {
            totalSales: result.reduce((sum, product) => sum + product.totalSales, 0),
            totalOrders: result.reduce((sum, product) => sum + product.totalOrders, 0),
            productSold: result.reduce((sum, product) => sum + product.itemsSold, 0),
            variationSold: result.reduce((sum, product) => sum + product.variationSold, 0),
            products: result,
        };
    } catch (error) {
        console.error('Error in getProductData:', error);
        throw error;
    }
};

// Helper function to get variations by productId
const getVariationsByProductId = async (productId) => {
    const variations = await Variations.findAll({
        where: { productId },
        attributes: ['id'],
    });
    return variations.map(variation => variation.id);
};



export const getByOrders = async (startDate, endDate, orderStatus, search, sortBy, sortOrder) => {

    try {
        // Date range filter
        const dateRange = {};
        if (startDate && endDate) {
            dateRange.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }

        // Order status filter
        const statusFilter = orderStatus ? { orderStatus } : {};

        // Search filter
        const searchFilter = search
            ? {
                [Op.or]: [
                    { invoiceNumber: { [Op.like]: `%${search}%` } },
                ],
            }
            : {};

        // Get orders grouped by `invoiceNumber` or similar grouping criteria
        const ordersData = await TransactionDetails.findAll({
            where: {
                ...dateRange,
                ...statusFilter,
                ...searchFilter,  // Include search filter for productName
            },
            include: [
                {
                    model: Variations,
                    include: {
                        model: Products,
                        attributes: ['productName'],
                    },

                },
            ],
            order: [[sortBy || 'createdAt', sortOrder || 'ASC']],
        });

        const result = [];
        let totalSales = 0; // Initialize totalSales
        let totalOrders = 0; // Initialize totalOrders
        let totalItemsSold = 0; // Initialize totalItemsSold

        // Process each order to calculate necessary aggregates
        for (const order of ordersData) {
            // Get total sales (total nominal) per product
            const productTotalSales = await TransactionDetails.sum('subtotal', {
                where: {
                    ...dateRange,
                    ...statusFilter,
                    ...searchFilter,
                    // Get variations of the product
                },
            });

            // Get total orders (jumlah transaksi dengan orderStatus = 'Done') per product
            const productTotalOrders = await TransactionDetails.count({
                where: {
                    ...dateRange,
                    ...statusFilter,
                    ...searchFilter,
                    // Get variations of the product
                },
            });

            // Increment the overall totals
            totalSales = productTotalSales;
            totalOrders = productTotalOrders;
            totalItemsSold += order.quantity;

            // Push processed order data
            result.push({
                id: order.id,
                createdAt: order.createdAt,
                kodeInvoice: order.invoiceNumber,
                orderStatus: order.orderStatus,
                customerId: order.customerId,
                productName: order.variation.product.productName || null,
                itemSold: order.quantity,
                totalPrice: order.subtotal, // Assuming `subtotal` represents the total for this order
            });
        }

        // Calculate aggregates based on processed result
        const averageOrderValue = totalOrders ? totalSales / totalOrders : 0;
        const averageItemsPerSale = totalOrders ? totalItemsSold / totalOrders : 0;

        // Return data in a structured format
        return {
            totalSales,
            totalOrders,
            averageOrderValue,
            averageItemsPerSale,
            orders: result,
        };
    }
    catch (error) {
        console.error('Error in getByOrders:', error);
        throw error;
    }
};

export const getByAgents = async (startDate, endDate, search, sortBy, sortOrder) => {
    try {
        // Date range filter
        const dateRange = {};
        if (startDate && endDate) {
            dateRange.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }

        // Total sales
        const totalSales = await TransactionDetails.sum('subtotal', {
            where: dateRange,
        });

        // Total orders (jumlah transaksi dengan orderStatus = 'Done')
        const totalOrders = await TransactionDetails.count({
            where: dateRange,
        });

        // Total items sold
        const totalItemsSold = await TransactionDetails.sum('quantity', {
            where: dateRange,
        });

        // Calculate averages
        const averageOrderValue = totalOrders ? totalSales / totalOrders : 0;
        const averageItemsPerSale = totalOrders ? totalItemsSold / totalOrders : 0;

        // Aggregate data for agents
        const agentsQuery = `
            SELECT 
                a.id, 
                a.name, 
                COUNT(td.id) AS totalOrders, 
                SUM(td.quantity) AS productSold
            FROM 
                agents a
            LEFT JOIN 
                customers c ON c.agentId = a.id
            LEFT JOIN
                transactionCustomers tc ON tc.customerId = c.id
            LEFT JOIN 
                transactionDetails td ON td.id = tc.transactionId
            ${startDate && endDate ? `WHERE td.createdAt BETWEEN :startDate AND :endDate` : ''}
            ${search ? `${startDate && endDate ? 'AND' : 'WHERE'} a.name LIKE :search` : ''}
            GROUP BY a.id
            ${sortBy ? `ORDER BY ${sortBy} ${sortOrder || 'ASC'}` : 'ORDER BY a.name ASC'}
        `;

        // Execute the raw SQL query with parameterized values
        const agents = await db.query(agentsQuery, {
            replacements: {
                startDate: startDate,
                endDate: endDate,
                search: search ? `%${search}%` : undefined, // Search filter for name
                sortBy: sortBy, // Default to 'name' if not provided
                sortOrder: sortOrder, // Default to 'ASC' if not provided
            },
            type: db.QueryTypes.SELECT,
        });

        return {
            totalSales,
            totalOrders,
            averageOrderValue,
            averageItemsPerSale,
            agents: agents.map(agent => ({
                agentId: agent.id,
                agentName: agent.name,
                totalOrders: agent.totalOrders,
                productSold: agent.productSold,
            })),
        };
    } catch (error) {
        throw new Error(`Error in getByAgentsService: ${error.message}`);
    }
};



export const getAgentDetails = async (agentId, startDate, endDate, search, sortBy, sortOrder) => {
    try {
        // Membuat query SQL mentah untuk total sales
        // Total sales query
        const totalSalesQuery = `
            SELECT SUM(td.subtotal) AS totalSales
            FROM transactionDetails td
            INNER JOIN transactionCustomers tc ON td.id = tc.transactionId
            INNER JOIN customers c ON tc.customerId = c.id
            WHERE c.agentId = :agentId
            ${startDate && endDate ? `AND td.createdAt BETWEEN :startDate AND :endDate` : ''}
        `;

        // Total orders query
        const totalOrdersQuery = `
            SELECT COUNT(td.id) AS totalOrders
            FROM transactionDetails td
            INNER JOIN transactionCustomers tc ON td.id = tc.transactionId
            INNER JOIN customers c ON tc.customerId = c.id
            WHERE c.agentId = :agentId
            ${startDate && endDate ? `AND td.createdAt BETWEEN :startDate AND :endDate` : ''}
        `;

        // Total items sold query
        const totalItemsSoldQuery = `
            SELECT SUM(td.quantity) AS totalItemsSold
            FROM transactionDetails td
            INNER JOIN transactionCustomers tc ON td.id = tc.transactionId
            INNER JOIN customers c ON tc.customerId = c.id
            WHERE c.agentId = :agentId
            ${startDate && endDate ? `AND td.createdAt BETWEEN :startDate AND :endDate` : ''}
        `;

        // Membuat query SQL mentah untuk agent products details dengan pencarian dan sorting
        const agentsProductsQuery = `
            SELECT
                SUM(td.quantity) AS totalQuantitySold,
                SUM(td.subtotal*td.quantity) AS totalSales,
                v.productId,
                c.id AS customerId,
                p.productName,
                SUM(v.agentFee*td.quantity) AS commission
            FROM transactionDetails td
            INNER JOIN transactionCustomers tc ON td.id = tc.transactionId
            INNER JOIN customers c ON tc.customerId = c.id
            INNER JOIN variations v ON td.variationId = v.id
            INNER JOIN products p ON v.productId = p.id
            WHERE c.agentId = :agentId
            ${startDate && endDate ? `AND td.createdAt BETWEEN :startDate AND :endDate` : ''}
            ${search ? `AND p.productName LIKE :search` : ''}
            GROUP BY v.productId, c.id
            ${sortBy ? `ORDER BY ${sortBy} ${sortOrder || 'ASC'}` : 'ORDER BY productName ASC'}
        `;

        // Menentukan replacements untuk query SQL
        const replacements = {
            agentId,
            startDate: startDate, // Default ke 1970-01-01 jika startDate tidak ada
            endDate: endDate,
            search: search ? `%${search}%` : null, // Pencarian untuk productName
            sortBy: sortBy, // Default ke productName jika tidak ada sortBy
            sortOrder: sortOrder, // Default ke ASC jika tidak ada sortOrder
        };

        // Menjalankan total sales query
        const totalSalesResult = await db.query(totalSalesQuery, {
            replacements,
            type: db.QueryTypes.SELECT,
        });

        // Menjalankan total orders query
        const totalOrdersResult = await db.query(totalOrdersQuery, {
            replacements,
            type: db.QueryTypes.SELECT,
        });

        // Menjalankan total items sold query
        const totalItemsSoldResult = await db.query(totalItemsSoldQuery, {
            replacements,
            type: db.QueryTypes.SELECT,
        });

        // Menjalankan agent products query
        const agentsProductsResult = await db.query(agentsProductsQuery, {
            replacements,
            type: db.QueryTypes.SELECT,
        });

        // Menghitung averageOrderValue dan averageItemsPerSale
        const totalSales = totalSalesResult[0]?.totalSales || 0;
        const totalOrders = totalOrdersResult[0]?.totalOrders || 0;
        const totalItemsSold = totalItemsSoldResult[0]?.totalItemsSold || 0;

        const averageOrderValue = totalOrders ? totalSales / totalOrders : 0;
        const averageItemsPerSale = totalOrders ? totalItemsSold / totalOrders : 0;

        // Mengambil detail produk yang terjual
        const agentProductsDetails = agentsProductsResult.map((product) => ({
            productId: product.productId,
            productName: product.productName,
            totalQuantitySold: product.totalQuantitySold,
            totalSales: product.totalSales,
            commission: product.commission,
        }));

        // Menghitung total komisi
        const totalCommissionFee = agentProductsDetails.reduce((sum, product) => sum + product.commission, 0);

        return {
            totalSales,
            totalOrders,
            averageOrderValue,
            averageItemsPerSale,
            totalCommissionFee,
            agentProductsDetails,
        };
    } catch (error) {
        throw new Error(`Error in getAgentDetailsService: ${error.message}`);
    }
};
