const mongoose = require('mongoose');

// Middleware para validar el formato del ID de MongoDB
const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    console.log(`Validando el ID: ${id}`);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('ID no válido');
        return res.status(400).json({ message: 'ID no válido' });
    }
    console.log('ID válido, continuando');
    next();
};

module.exports = validateObjectId;