const Product = require('../models/product')

const getAllProductsStatic = async (req,res) => {


  const products = await Product.find({price:{ $gt:30 }}).sort('price').select('name price').limit(4)

  res.status(200).json({ products, nbHits: products.length })
}

  const getAllProducts = async (req,res) => {

  const {featured, company, name, sort, fields} = req.query   
  const queryObject = {}

  if(featured){
    queryObject.featured = featured === "true" ? true : false 
  }
  if(company){
    queryObject.company = company;
  }
  if(name) {
    queryObject.name = { $regex: name, $options: 'i' }
  } 
   // sorting
  let result = Product.find(queryObject)
  if(sort){
   
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  } else {
    result = result.sort('createdAt')
  }
  // selecting specific fields from the model to return from query
  if(fields) {
    const fieldsList = fields.split(',').join(' ')
    result = result.select(fieldsList)
  }

  // pagination

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  // 23 products atm / 7 = 4 pages; 7 7 7 2 products per page


  const products = await result
  res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
  getAllProductsStatic,
  getAllProducts
}