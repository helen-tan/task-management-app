const createUser = (req, res) => {
    res.status(201).json({
        success: true,
        message: 'Create new user route'
    })
}

const loginUser = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Login route'
    })
}

const getAllUsers = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'This route will display all users'
    })
}

module.exports = {
    createUser,
    loginUser,
    getAllUsers
}