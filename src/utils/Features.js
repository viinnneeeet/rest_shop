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

    //optimize way
    // const queryKey = Object.keys(queryCopy);
    // let qStr = {};
    // queryKey.forEach((key) => {
    //   const value = queryCopy[key];
    //   qStr.push(
    //     JSON.stringify({
    //       key: { $regex: value, $options: 'i' },
    //     })
    //   );
    // });

    //old implementation
    // let qStr = JSON.stringify(queryCopy);

    const [key1, key2, key3] = Object.keys(queryCopy);
    const [value1, value2, value3] = Object.values(queryCopy);

    let qStr = JSON.stringify({
      name: { $regex: value1, $options: 'i' },
      name2: { $regex: value2, $options: 'i' },
      name3: { $regex: value3, $options: 'i' },
    });

    qStr = qStr.replace('name', key1);
    qStr = qStr.replace('name2', key2);
    qStr = qStr.replace('name2', key3);

    qStr = qStr.replace(/\b(gt|gte|lt|lte)\b/g, (with$) => `$${with$}`);

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
