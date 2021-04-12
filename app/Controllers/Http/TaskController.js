'use strict'

const TaskModel = use('App/Models/Task')

class TaskController {
  async index ({ params }) {
    const tasks = await TaskModel.query().where('project_id', params.projects_id).with('user').fetch()
    return tasks
  }

  async store ({ params, request }) {
    const data = request.only(['user_id', 'title', 'description', 'due_date', 'file_id'])
    const task = await TaskModel.create({ ...data, project_id: params.projects_id })
    return task
  }

  async show ({ params }) {
    const task = await TaskModel.findOrFail(params.id)
    return task
  }

  async update ({ params, request }) {
    const task = await TaskModel.findOrFail(params.id)
    const data = request.only(['user_id', 'title', 'description', 'due_date', 'file_id'])
    task.merge(data)
    await task.save()
  }

  async destroy ({ params }) {
    const task = await TaskModel.findOrFail(params.id)
    await task.delete()
  }
}

module.exports = TaskController
