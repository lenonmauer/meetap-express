const File = require('../models/File');

class FileController {
  async show (req, res) {
    const file = await File.findById(req.params.id);

    res.sendFile(file.path);
  }

  async store (req, res) {
    const { file } = req;

    const data = {
      type: file.mimetype,
      name: file.filename,
      path: file.path,
    };

    const record = await File.create(data);

    res.json(record);
  }
}

module.exports = new FileController();
