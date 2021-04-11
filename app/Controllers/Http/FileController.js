'use strict'

const FileModel = use('App/Models/File')
const Helpers = use('Helpers')

class FileController {
  async show ({ params, response }) {
    const file = await FileModel.findOrFail(params.id)
    return response.download(Helpers.tmpPath(`uploads/${file.file}`))
  }

  async create ({ request, response }) {
    try {
      if (!request.file('file')) return

      const upload = request.file('file', { size: '1mb' })
      const fileName = `${Date.now()}.${upload.subtype}`
      await upload.move(Helpers.tmpPath('uploads'), { name: fileName })

      if (!upload.move()) throw upload.error()

      const file = await FileModel.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      })

      return file
    } catch (error) {
      console.error(error.message)
      return response.status(error.status).send({ error: { message: 'Error no upload de arquivo' } })
    }
  }
}

module.exports = FileController
