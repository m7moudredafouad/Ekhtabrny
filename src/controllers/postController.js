const Post = require('../models/post')
const Comment = require('../models/comment')
const Member = require('../models/member')
const Vote = require('../models/vote')
const AppError = require('../utils/appError')

exports.doesPostExist = async (req, res, next) => {
    const post = await Post.findOne({_id: req.params.postId})

    if(!post) {
        return next(new AppError('Post not found', 404))
    }

    req.post = post
    next();
}

exports.getAllPosts =  async (req, res, next) => {
    try{
        let query;
        let groups;
        let select;
        let populate;

        if(req.params.groupid){
            query = {groupId: req.params.groupid}
            select = 'content userId createdAt';
        } else {
            groups = await Member.find({userId: req.user._id, role: {$in: ['member', 'admin']}}).select('groupId -_id')
            groups = groups.map((group) => {return group.groupId})
            query = {groupId: {$in: groups}}
            select = 'content userId createdAt groupId'
            populate = {
                    path: 'groupId',
                    select: 'name'
                }
        }

        const page = parseInt(req.query.page) || 1
        const limit = 3
        const skip = (page - 1) * limit 

        const posts = await Post.find(query).sort({createdAt: -1})
        .select(select).populate(populate)
        .limit(limit)
        .skip(skip)

        if(!posts){
            return next(new AppError('Post not found', 404))
        }

        res.status(200).json({
            status: "Success",
            posts,
            me: {
                _id: req.user._id
            }
        })

    } catch(err){
        next(err)
    }
}

exports.getPost = async (req, res, next) => {
    try{
        const post = await Post.findById(req.params.postId)
        if(!post){
            return next(new AppError('Post not found', 404))
        }

        res.status(201).json({
            status: "Success",
            post
        })

    } catch(err){
        next(err)
    }
}

exports.createPost = async (req, res, next) => {
    try{
        const post = await Post.create({
            groupId: req.group._id,
            userId: req.user._id,
            content: req.body.post
        })
        
        res.status(201).json({
            status: "Success",
            post: {
                _id: post._id,
                userId: post.userId,
                content: post.content,
                createdAt: post.createdAt,
            },
            user: {
                _id: req.user._id,
                name: req.user.name
            }
        })

    } catch(err){
        next(err)
    }
}

exports.updatePost = async (req, res, next) => {
    try{

        const post = await Post.findOneAndUpdate({
            _id: req.params.postId,
            userId: req.user._id
        }, {content: req.body.post}, {
            new: true,
            runValidators: true
        })
        if(!post){
            return next(new AppError('Post not found', 404))
        }

        res.status(201).json({
            status: "Success",
            post
        })

    } catch(err){
        next(err)
    }
}


exports.deletePost = async (req, res, next) => {
    try{

        await Post.findByIdAndDelete({_id: req.params.postId, userId: req.user._id})
    
        res.status(201).json({
            status: "Success"
        })

    } catch(err){
        next(err)
    }
}


exports.loadComments = async (req, res, next) => {
    try{
        const page = parseInt(req.query.page) || 1
        const limit = 5
        const skip = (page - 1) * limit 


        const comments = await Comment.find({postId: req.post._id})
        .sort({createdAt: -1})
        .limit(limit)
        .skip(skip)
        .populate('userId', 'name')

        res.status(200).json({
            status: 'Success',
            comments
        })

    } catch(err){
        next(err);
    }
}

exports.createComment = async (req, res, next) => {
    try{
        const comment = await Comment.create({
            postId: req.params.postId,
            userId: req.user._id,
            content: req.body.comment
        })

        res.status(201).json({
            status: "Success",
            comment,
            user: {
                _id: req.user._id,
                name: req.user.name
            }
        })

    } catch(err){
        next(err)
    }
}

exports.updateComment = async (req, res, next) => {
    try{
        const comment = await Comment.findOneAndUpdate({
            postId: req.params.postId,
            userId: req.user._id,
        },{
            content: req.body.comment
        }, {
            new: true,
            runValidators: true
        })

        res.status(201).json({
            status: "Success",
            comment
        })

    } catch(err){
        next(err)
    }
}

exports.deleteComment = async (req, res, next) => {
    try{
        await Comment.findOneAndDelete({
            postId: req.params.postId,
            userId: req.user._id,
        })

        res.status(201).json({
            status: "Success",
        })

    } catch(err){
        next(err)
    }
}

exports.vote = async (req, res, next) => {
    try{
        const vote = await Vote.findOne({
            postId: req.post._id,
            userId: req.user._id
        })

        if(vote) {
            await Vote.findOneAndDelete({
                postId: req.post._id,
                userId: req.user._id
            })
        } else {
            await Vote.create({
                postId: req.post._id,
                userId: req.user._id
            })
        }

        res.status(200).json({
            status: 'Success'
        })
    } catch(err){
        next(err)
    }
}