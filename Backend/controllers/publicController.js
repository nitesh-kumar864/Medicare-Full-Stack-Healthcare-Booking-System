import { getPublicStatsService } from "../services/publicStats.Service.js";

export const getPublicStats = async (req, res) => {

    try {
        const result = await getPublicStatsService();
        res.json(result);
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to the fatch stats"
        });
    }
}