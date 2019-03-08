class CategoryController {
  async index (req, res) {
    return res.send([
      {
        id: 'front-end',
        name: 'Front-end',
      },
      {
        id: 'back-end',
        name: 'Back-end',
      },
      {
        id: 'mobile',
        name: 'Mobile',
      },
      {
        id: 'dev-ops',
        name: 'DevOps',
      },
      {
        id: 'gestao',
        name: 'Gestão',
      },
      {
        id: 'Marketing',
        name: 'marketing',
      },
    ]);
  }
}

module.exports = new CategoryController();
