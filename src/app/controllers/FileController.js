const File = require('../models/File');

class FileController {
  async store (req, res) {
    const { originalname: name, key, size, location: url = '' } = req.file;

    if (!req.file) {
      return res.status(400).send({
        error: 'Nenhum arquivo enviado',
      });
    }

    const data = {
      key,
      name,
      url,
      size,
    };

    const record = await File.create(data);

    return res.json(record);
  }
}

module.exports = new FileController();
