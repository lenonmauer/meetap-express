const File = require('../models/File');
const path = require('path');

class FileController {
  async show (req, res) {
    const file = await File.findById(req.params.id);
    const filepath = path.join(file.path, file.name);

    res.sendFile(filepath);
  }

  async store (req, res) {
    const { file } = req;

    if (!req.file) {
      return res.status(400).send({
        error: 'Nenhum arquivo enviado',
      });
    }

    const data = {
      type: file.mimetype,
      name: file.filename,
      path: file.destination,
    };

    const record = await File.create(data);

    return res.json(record);
  }
}

module.exports = new FileController();
