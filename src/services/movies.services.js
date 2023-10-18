const db = require("../database/models")
const getAllMovies = async (limit, offset) => {

    try {
        const movies = await db.Movie.findAll({
            limit,
            offset,
            attributes: {
                exclude: ['created_at', 'updated_at']
            },
            incluide: [
                {
                    association: 'genre',
                    attributes: ['id', 'name']
                },
                {
                    association: 'actors',
                    attributes: ['id', 'first_name', 'last_name'],
                    through: {
                        attributes: []
                    }
                }
            ],
        })
        const count = await db.Movie.count()
        console.log(count);
        return {
            movies,
            count
        }
    } catch (error) {
        console.log(error);
        throw {
            status: error.status || 500,
            message: error.message || 'ERROR en servicio'
        }
    }

}
const getMovieById = async (id) => {
    try {
        if (!id) {
            throw {
                status: 400,
                message: 'ID inexistente'
            }
        }
        const movie = await db.Movie.findByPk(id, {
            attributes: {
                exclude: ['created_at', 'updated_at']
            },
            incluide: [
                {
                    association: 'genre',
                    attributes: ['id', 'name']
                },
                {
                    association: 'actors',
                    attributes: ['id', 'first_name', 'last_name'],
                    through: {
                        attributes: []
                    }
                }
            ],
        })
        if (!movie) {
            throw {
                status: 400,
                message: 'No hay una pelicula con ese ID'
            }
        }
        return movie
    } catch (error) {
        console.log(error);
        throw {
            status: error.status || 500,
            message: error.message || 'ERROR en servicio'
        }
    }
}

const storeMovie = async (dataMovie, actors) => {
    try {
        const newMovie = await db.Movie.create(dataMovie)
        if (actors) {
            const actorsDB = actors.map(actor => {
                return {
                    movie_id: newMovie.id,
                    actor_id: actor
                }
            })
            await db.Actor_Movie.bulkCreate(actorsDB, {
                validate: true
            })
        }
        return await getMovieById(newMovie.id)
    } catch (error) {
        console.log(error);
        throw {
            status: error.status || 500,
            message: error.message || 'ERROR en servicio'
        }
    }
}

module.exports = {
    getAllMovies,
    getMovieById,
    storeMovie
}