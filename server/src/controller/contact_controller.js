const Contact = require('../models/contact_model');

createContact = (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'Você deve fornecer um contato.',
    });
  }

  const contact = new Contact(body);

  if (!contact) {
    return res.status(400).json({
      success: false,
      error: err,
    });
  }

  contact
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: contact._id,
        message: 'Contato criado com sucesso!',
      });
    })
    .then(() => {})
    .catch((err) => {
      return res.status(400).json({
        error: err,
        message: 'Falha ao criar um contato!',
      });
    });
};

updateContact = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'Você deve fornecer um contato para atualizar.',
    });
  } else {
    await Contact.findOne({ _id: req.params.id }, (err, contact) => {
      if (err) {
        return res.status(404).json({
          error: err,
          message: 'Contato não encontrado!',
        });
      }

      Object.assign(contact, body);

      contact
        .save()
        .then(() => {
          return res.status(200).json({
            success: true,
            id: contact.nome,
            message: 'Contato atualizado!',
          });
        })
        .catch((err) => {
          return res.status(404).json({
            err,
            message: 'Falha ao atualizar o contato!',
          });
        });
    });
  }
};

deleteContact = async (req, res) => {
  await Contact.findOneAndDelete({ _id: req.params.id }, (err, contact) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contato não encontrado.',
      });
    }

    return res.status(200).json({
      success: true,
      data: contact.nome,
      message: 'Contato deletado com sucesso.',
    });
  }).catch((err) => console.error(err));
};

getContactById = async (req, res) => {
  await Contact.findOne({ _id: req.params.id }, (err, contact) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
        message: 'Contato não encontrado!',
      });
    }

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contato não encontrado!',
      });
    }
    return res.status(200).json({
      success: true,
      data: contact,
    });
  }).catch((err) => console.error(err));
};

getContacts = async (req, res) => {
  await Contact.find({})
    .populate('orders')
    .exec((err, contacts) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err,
        });
      }
      if (!contacts.length) {
        return res.status(404).json({
          success: false,
          error: 'Contatos não encontrados!',
        });
      }
      return res.status(200).json({
        success: true,
        data: contacts,
      });
    })
    .catch((err) => console.error(err));
};

module.exports = {
  createContact,
  updateContact,
  deleteContact,
  getContactById,
  getContacts,
};
