class Features {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    //{{DOMAIN}}/api/v/products?keyword=Pizza
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: 'i',
          },
        }
      : {};
    // console.log(,this.queryStr , 'queryStr');
    // console.log(this.query, 'query');
    this.query = this.query.find({ ...keyword });
    return this;
    //return Instance so that  ..new QH().search().filter().paginate()
    //chaining works
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    // Removing some field for category
    const removeFields = ['keyword', 'page', 'limit'];

    removeFields.forEach((key) => delete queryCopy[key]);
    //Advance Filter for Price rating....etc

    let qStr = JSON.stringify(queryCopy);
    qStr = qStr.replace(/\b(gt|gte|lt|lte)\b/g, (with$) => `$${with$}`);
    console.log(qStr);
    this.query = this.query.find(JSON.parse(qStr));
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    // page=1 , skip=5*0=0
    // page=2 , skip=5*1=5
    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = Features;
