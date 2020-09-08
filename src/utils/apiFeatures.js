class APIFeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filter() {
        const queryObj = {...this.queryString}  // Destructuring the query in a new object   if => queryObj = req.query  on update cascade

        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        // 2-) ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj)
        queryStr = JSON.parse(queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`))
        
        this.query = this.query.find(queryStr);

        return this;
    }

    sort() {
        if(this.queryString.sort){
            const sort = this.queryString.sort.split(',').join(' ')
            // sort(price duration maxGroupSize)
            this.query = this.query.sort(sort)
        } else {
            this.query = this.query.sort('createdAt')
        }
        return this;
    }

    limitFields() {
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ')
            this.query.select(fields)
        }

        return this
    }

    paginate() {
        const page = parseInt(this.queryString.page) || 1
        const limit = parseInt(this.queryString.limit) || 5
        const skip = (page - 1) * limit   // معادله هامه

        this.query.skip(skip).limit(limit)

        return this
    }

}

module.exports = APIFeatures;


// BUILD QUERY
// 1-) FILTERING
// const queryObj = {...req.query}  // Destructuring the query in a new object   if => queryObj = req.query  on update cascade

// const excludedFields = ['page', 'sort', 'limit', 'fields']
// excludedFields.forEach(el => delete queryObj[el])

// // 2-) ADVANCED FILTERING
// let queryString = JSON.stringify(queryObj)
// queryString = JSON.parse(queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`))

// شرح السطرين اللي فوق
// { duration: { gte: '4' } }  المفروض ف الاول ال query  بتكون كدا
// { duration: { '$gte': '4' } }  احنا عايزينها كدا

// let query = Tour.find(queryString);

// 3-) SORTING
// if(req.query.sort){
//     const sort = req.query.sort.split(',').join(' ')
//     // sort(price duration maxGroupSize)
//     query = query.sort(sort)
// }


// 3-) LIMITINGING
// if(req.query.fields){
//     const fields = req.query.fields.split(',').join(' ')
//     query.select(fields)
// }

// 4-) PAGINATION
// const page = parseInt(req.query.page) || 1
// const limit = parseInt(req.query.limit) || 5
// const skip = (page - 1) * limit   // معادله هامه

// query.skip(skip).limit(limit)

// if(req.query.page) {
//     const numTours = await Tour.countDocuments();

//     if(skip >= numTours){
//         throw new Error('Page doesn\'t exsit')
//     }
// }

// query.sort().select().skip().limit() 