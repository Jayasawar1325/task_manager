import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const getTasks = asyncHandler(async(req,res)=>{
    const tasks = await Task.find()
    res.status(200)
    .json({
        message:'Get all tasks successfully',
        data:tasks
    }) 
})
export const getTask = asyncHandler(async(req,res)=>{
    const task = await Task.findById(req.params.id)
    if(!task){
        throw new ApiError(401,'Task not found')
    }
    res.status(200)
    .json({
        message:'Get one task successfully',
        data:task
    })
})
export const updateTask = asyncHandler(async(req,res)=>{
    const task = await Task.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    res.status(200)
    .json({
        message:'Task updated Successfully',
        success:true,
        data:task
    })
})
export const deleteTask = asyncHandler(async(req,res)=>{
    const task = await Task.findById(req.params.id)
    if(!task){
        throw new ApiError(404,'Task not found')
    }
    await task.deleteOne()
    return res.status(200)
    .json({
        message:'Task deleted successfully',
        data:{}
    })
})
export const createTask = asyncHandler(async(req,res)=>{
    const task = await Task.create(req.body)
     res.status(200)
     .json({
        message:'Tasks created successfully',
        data:task
    })
})