import { Router } from "express";
import { createTask,getTask,getTasks,deleteTask,updateTask} from "../controllers/task.controller.js";
const taskRouter = Router()
taskRouter.route('/').post(createTask)
taskRouter.route('/').get(getTasks)
taskRouter.route('/:id').get(getTask)
taskRouter.route('/:id').put(updateTask)
taskRouter.route('/:id').delete(deleteTask)
export {taskRouter}