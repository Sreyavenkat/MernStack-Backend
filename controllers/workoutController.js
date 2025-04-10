const Workout = require('../models/workoutModel')
const mongoose = require('mongoose')

// get alll workouts
const getWorkouts = async(req,res) => {
    const workouts = await Workout.find({}).sort({createdAt: -1})

    res.status(200).json(workouts)
}

// get a single workout
const getWorkout = async(req,res) =>{
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such workout'}) 
    }

    const workout = await Workout.findById(id)

    if(!workout){
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json(workout)
}


// create new workout
const createWorkout = async(req,res) => {
    const{title, load, reps} = req.body

    let emptyFields = []

    if(!title) {
        emptyFields.push('title')
    }

    if(!load) {
        emptyFields.push('load')
    }

    if(!reps) {
        emptyFields.push('reps')
    }

    if(emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fil in all the fields' , emptyFields})
    }
    
    //add doc to db
    try{
        const workout = await Workout.create({title, load, reps})
        res.status(200).json(workout)
    } catch(error) {
        res.status(400).json({error :error.message})
    }
}


// delete a workout
const deleteWorkout = async(req,res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such workout'}) 
    }

    const workout = await Workout.findOneAndDelete({_id: id})   //"_id" is the property and id is the one we give

    if(!workout){
        return res.status(404).json({error: 'No such workout'})
    }  

    res.status(200).json(workout)
}


//update a workout
const updateWorkout = async(req,res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such workout'}) 
    }

    const workout = await Workout.findOneAndUpdate({_id: id}, {
        ...req.body   //data to be updated (to spread the req.body across the fn , ... is used)
    })

    if(!workout){
        return res.status(404).json({error: 'No such workout'})
    } 

    res.status(200).json(workout)
}


module.exports = {
    getWorkouts,
    getWorkout,
    createWorkout,
    deleteWorkout,
    updateWorkout
}