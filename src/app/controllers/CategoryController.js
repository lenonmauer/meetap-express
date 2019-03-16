class CategoryController {
  index (req, res) {
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
        id: 'marketing',
        name: 'Marketing',
      },
    ]);
  }
}

module.exports = new CategoryController();
