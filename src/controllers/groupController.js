const Group = require('../models/group')
const Answer = require('../models/answer')
const Member = require('../models/member')
const AppError = require('../utils/appError')


exports.restrictToInGroup = (...roles) => {
    return async (req, res, next) => {
        // roles. is an array ['admin, member', 'pending']
        const group = await Group.findById(req.params.groupid)
        if(!group){
            return next(new AppError('Group not found', 404));
        }

        const member = await Member.findOne({groupId: req.params.groupid, userId: req.user.id})


        if(!member || !roles.includes(member.role)){
            return next(new AppError('You don\'t have the permission', 404));
        }

        req.group = group;
        res.locals.isAdmin = (member.role === 'admin')
        next();
    }
}

exports.restrictToMeAndAdmins = async (req, res, next) => {

    const group = await Group.findById(req.params.groupid);

    if(!group){
        return next(new AppError('Group not found', 404));
    }
    
    const member = await Member.findOne({groupId: req.params.groupid, userId: req.params.memberid})
    const meInGroup = await Member.findOne({groupId: req.params.groupid, userId: req.user._id})
    
    

    if(member && meInGroup && (meInGroup.role == "admin" || req.user._id == req.params.memberid)){
        req.group = group;
        next();
    } else {
        return next(new AppError('You don\'t have the permission', 404));
    }
    

}


exports.getMyGroups = async (req, res, next) => {
    try{
        const groups = await Member.find({userId: req.user._id, role: 'admin'}).select('groupId')

        res.status(200).json({
            status: 'Success',
            groups
        })

    } catch(err){
        next(err);
    }
}

exports.getAllPending = async (req, res, next) => {
    try{
        const pending = await Member.find({groupId: req.params.groupid, role: "pending"}).select('userId code')

        res.status(200).json({
            status: 'Success',
            pending
        })

    } catch(err){
        next(err);
    }
}


exports.getAllMembers = async (req, res, next) => {
    try{
        const members = await Member.find({groupId: req.params.groupid, role: {$in: ["admin", "member"]}}).sort('code').select('userId role code')

        res.status(200).json({
            status: 'Success',
            members
        })

    } catch(err){
        next(err);
    }
}


exports.createGroup = async (req, res, next) => {
    try{

        const group = await Group.create({name: req.body.name})
        const admin = await Member.create({
            groupId: group._id,
            userId: req.user._id,
            name: req.user.name,
            code: 0,
            role: 'admin'
        })

        res.status(201).json({
            status: "Success",
            group,
            admin
        })

    } catch(err){
        next(err);
    }
}


exports.addMember = async (req, res, next) => {
    try{
        
        const member =  await Member.findOneAndUpdate({
            groupId: req.params.groupid,
            userId: req.params.memberid,
            role: 'pending'
        }, {
            role: 'member'
        }, {
            new: true,
            runValidators: true
        })

        if(!member){
            return next(new AppError('This pending member not found', 404));
        }

        res.status(200).json({
            status: "Success",
            member
        })


    } catch(err){
        next(err);
    }
}


exports.requestToJoinGroup = async (req, res, next) => {
    try{
        const group = await Group.findById(req.params.groupid);
        
        if(!group){
            return next(new AppError('Group not found', 404));
        }
            const member = await Member.create({
                groupId: req.params.groupid,
                userId: req.user._id,
                name: req.body.name,
                code: req.body.code
            })
            
            if(!member) {
                return next(new AppError('Code aleady exists', 404));
            }            

        res.status(200).json({
            status: "Success",
            member
        })

    } catch(err){
        next(err);
    }
}

exports.removeRequestToJoinGroup = async (req, res, next) => {
    try{

        const member = await Member.findOneAndDelete({groupId: req.params.groupid, userId: req.params.memberid})
        const answers = await Answer.findAndDelete({groupId: req.params.groupid, userId: req.params.memberid})

        if(!member) {
            return next(new AppError('No user found in the group', 404));
        }

        res.status(200).json({
            status: "Success",
        })

    } catch(err){
        next(err);
    }
}




