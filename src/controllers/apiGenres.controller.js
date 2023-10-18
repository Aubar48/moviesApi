const { getAllGenres } = require("../services/genres.services")

module.exports = {

    index: async (req, res) => {
        try {
            const genres = await getAllGenres()
            return res.status(200).json({
                ok: true,
                data: genres
            })
        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message || 'upss, error'
            })
        }
    },
    show: (req, res) => {

    }

}