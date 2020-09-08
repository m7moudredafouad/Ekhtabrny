const AppError = require('../utils/appError')
const APIFeatures = require('../utils/apiFeatures')


exports.deleteOne = Model => {
    return async (req, res, next) => {
        try{
    
            const doc = await Model.findByIdAndRemove(req.params.id)
    
            if(!doc){
                return next(new AppError('document not found', 404))
            }
    
            res.status(204).json({
                status: 'success',
                data: null
            })
    
        } catch(err){
            next(err)
        }
    }
}

exports.updateOne = Model => { 
    return async (req, res, next) => {
        try{

            const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            })

            if(!doc){
                return next(new AppError('Document not found', 404))
            }

            res.status(200).json({
                status: 'success',
                doc
            })

        } catch(err){
            next(err)
        }

    }
}

exports.createOne = Model => {
    return async (req, res, next) => {

        try{
    
            const doc = await Model.create(req.body)
    
            res.status(201).json({
                status: 'success',
                doc
            })
    
        } catch(err){
            next(err)
        }
    
    }
}

exports.getOne = (Model, populateOption) => {
    return async (req, res, next) => {
    
        try{
    
            let query = Model.findById(req.params.id)

            if(populateOption){
                query = query.populate(populateOption);
            }
            
            const doc = await query

            if(!doc){
                return next(new AppError('document not found', 404))
            }
    
    
            res.status(200).json({
                status: 'success',
                doc
            })
    
        } catch(err){
            next(err)
        }
    }
}

exports.getAll = (Model) => {
    return async (req, res) => {
        try{
            let filter = {}
            if(req.params.tourId) filter = {tour: req.params.tourId}

            const features = new APIFeatures(Model.find(filter), req.query).filter().sort().paginate();
    
            // EXECUTE QUERY
            const docs = await features.query;
    
            res.status(200).json({
                status: 'success',
                results: docs.length,
                docs
            })
    
        } catch(err){
            res.status(404).json({
                status: 'faild',
                message: err
            })
        }
    }
}