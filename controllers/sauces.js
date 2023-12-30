const { use } = require('../app');
const Sauces = require('../models/sauces')
const fs = require('fs')
const jwt = require('jsonwebtoken')


exports.getAllSauces = (req, res, next)=>{
    Sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}
exports.getASauce = (req, res, next)=>{
    Sauces.findOne({_id: req.params.id})
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}

exports.createSauce = (req, res, next)=>{
    const reqParse = JSON.parse(req.body.sauce)
    delete reqParse._id
    delete reqParse.userId

    const sauces = new Sauces({
        ...reqParse,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauces.save()
    .then(() => res.status(200).json({message : "Sauce créée"}))
    .catch(error => res.status(400).json({ error }));
}

exports.modifyASauce = (req, res, next)=>{
    const SauceObject = req.file ? {
        ...JSON.parse(req.body.sauce), 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }

    delete SauceObject.userId

    Sauces.findOne({_id : req.params.id})
        .then((sauce) =>{
            if (sauce.userId == req.auth.userId){
                Sauces.updateOne({_id: req.params.id}, { ...SauceObject, _id: req.params.id})
                    .then(()=> res.status(200).json({ message: "objet modifié"}))
                    .catch(error => res.status(400).json({error}))
            }
            else{
                res.status(401).json({message: "vous ne pouvez pas modifiez cette sauce"})
            }
        })
        .catch(error => res.status(403).json({error}))
}

exports.deleteASauce = (req, res, next )=>{
    Sauces.findOne({_id: req.params.id})
        .then((sauce)=>{
            if(sauce.userId == req.auth.userId){
                const filename = sauce.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () =>{
                    Sauces.deleteOne({_id: req.params.id})
                    .then(()=> res.status(200).json({message: "Sauce supprimée"}))
                    .catch(error => res.status(400).json({error}))
                })

            }
            else{
                res.status(401).json({message: "vous ne pouvez pas supprimer cette sauce"})
            }
        })
        .catch(error => res.status(400).json({error}))
}

exports.likeASauce = (req, res, next) =>{

    const DoesUserLike = req.body.like

    Sauces.findOne({_id: req.params.id})
    .then((sauce) =>{
        
        const sauceIsLike = sauce.usersLiked.includes(req.auth.userId)
        const sauceIsDislike = sauce.usersDisliked.includes(req.auth.userId)
        
        if(DoesUserLike == 1){
            if(sauceIsLike == true){
                return res.status(200).json({message: "Cette sauce est deja likée par cette utilisateur!"})
            }
            else if(sauceIsDislike == true){
                Sauces.updateOne({_id: req.params.id},{$inc: {likes: 2}, $pull: {usersDisliked: req.auth.userId}, $push: {usersLiked : req.auth.userId}, _id: req.params.id})
                .then(() => res.status(200).json({message : "Like mis à jour"}))
                .catch(error => res.status(400).json({error}))
            }
            else {
                Sauces.updateOne({_id: req.params.id},{$inc: {likes: 1}, $push: {usersLiked: req.auth.userId}, _id: req.params.id})
                .then(() => res.status(200).json({message : "Like mis à jour"}))
                .catch(error => res.status(400).json({error}))
            }
        }
        else if(DoesUserLike == -1){
            if (sauceIsDislike == true){
                return res.status(200).json({message: "Cette sauce est deja dislikée par cette utilisateur! "})

            }
            else if(DoesUserLike == true){
                Sauces.updateOne({_id: req.params.id},{$inc: {likes: -2}, $push: {usersDisliked: req.auth.userId}, $pull: {usersLiked : req.auth.userId}, _id: req.params.id})
                .then(() => res.status(200).json({message : "Dislike mis à jour"}))
                .catch(error => res.status(400).json({error}))
            }
            else{
                Sauces.updateOne({_id: req.params.id},{$inc: {likes: -1}, $push: {usersDisliked: req.auth.userId}, _id: req.params.id})
                .then(() => res.status(200).json({message : "Like mis à jour"}))
                .catch(error => res.status(400).json({error}))
            }
        }
        else if(DoesUserLike == 0){
            if(sauceIsLike == true){
                Sauces.updateOne({_id: req.params.id},{$inc: {likes: -1}, $pull: {usersLiked : req.auth.userId}, _id: req.params.id})
                .then(() => res.status(200).json({message : "Dislike mis à jour"}))
                .catch(error => res.status(400).json({error}))
            }
            else if(sauceIsDislike == true){
                Sauces.updateOne({_id: req.params.id},{$inc: {likes: 1}, $pull: {usersDisliked : req.auth.userId}, _id: req.params.id})
                .then(() => res.status(200).json({message : "Dislike mis à jour"}))
                .catch(error => res.status(400).json({error}))
            }
            else{
                return res.status(200).json({message: "deja sans Avis"})
            }
        }
        
    })
    .catch(error => res.status(400).json({error}))
}
