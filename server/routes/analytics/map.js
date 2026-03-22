const Request = require('../../model/Request');

module.exports = (app) => {
    app.get('/api/v1/fetch-map', async (req, res, next) => {
        try {
            const mapDistribution = await Request.aggregate([
                {
                    $match: {
                        // Exclude requests where the WAF decision was 'log_only'.
                        wafDecision: { $ne: 'log_only' },
                        // Ensure we only process documents that have a country code.
                        countryCode: { $ne: null, $ne: '' }
                    }
                },
                {
                    $group: {
                        _id: '$countryCode', // Group by the 'countryCode' field.
                        count: { $sum: 1 }    // For each group, count the number of documents.
                    }
                },
                {
                    // Stage 3: Reshape the output for cleaner, more intuitive results.
                    $project: {
                        _id: 0,                 // Exclude the default '_id' field from the output.
                        country: { $toLower: '$_id' }, // Rename '_id' to 'country' and convert to lowercase.
                        value: '$count'         // Rename the 'count' field to 'value'.
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                }
            ]);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            startDate.setHours(0, 0, 0, 0);

            const dailyData = await Request.aggregate([
                {
                    // Stage 1: Filter documents to the last 8 days
                    $match: {
                        timestamp: { $gte: startDate }
                    }
                },
                {
                    // Stage 2: Group by date and count based on the wafDecision
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                        log_only_count: {
                            $sum: { $cond: [{ $eq: ["$wafDecision", "log_only"] }, 1, 0] }
                        },
                        other_count: {
                            $sum: { $cond: [{ $ne: ["$wafDecision", "log_only"] }, 1, 0] }
                        }
                    }
                },
                {
                    // Stage 3: Sort by date to ensure chronological order
                    $sort: { _id: 1 }
                }
            ]);

            // Create a map for easy lookup of aggregated data by date
            const dataMap = new Map(
                dailyData.map(item => [item._id, {
                    log_only: item.log_only_count,
                    others: item.other_count
                }])
            );

            // Initialize arrays for the final response structure
            const log_only_data = [];
            const others = [];
            const categories = [];

            // Loop through the last 8 days to build the final response arrays.
            // This ensures that days with no requests are included with a count of 0.
            for (let i = 7; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);

                // Format date key as 'YYYY-MM-DD' to match the map keys
                const dateKey = d.toISOString().split('T')[0];
                // Format category label as 'DD/MM'
                const category = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;

                const dayData = dataMap.get(dateKey) || { log_only: 0, others: 0 };

                log_only_data.push(dayData.log_only);
                others.push(dayData.others);
                categories.push(category);
            }

            return res.send({
                success : true,
                requests: mapDistribution,
                dailyStats: {
                    log_only_data,
                    others,
                    categories
                }
            });
        } catch (err) {
            return next(err);
        }
    })
}