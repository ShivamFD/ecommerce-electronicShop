import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Container, Button } from 'react-bootstrap';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useSelector } from 'react-redux';

import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import styled from 'styled-components';





const HomePageContainer = styled(Container)`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;


  @media (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 20px;
  }
`;



const FiltersContainer = styled.div`
width: 25%;
height: auto;
  background-color: rgba(27, 178, 175, 0.062);
  color: black;
  font-weight: 500;
  font-size: 17px;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;

  @media (max-width: 768px) {
   width: 100%;
   background-color: rgba(27, 178, 175, 0.29);
    margin-bottom: 20px;
  }
`;

const Heading = styled.h3`
  margin-bottom: 15px;
`;

const SubHeading = styled.h4`
  margin-top: 20px;
  margin-bottom: 10px;
`;

const StyledFormGroup = styled(Form.Group)`
  margin-bottom: 15px;
  
`;
const FormControl=styled(Form.Control)`
 width: 100%;

 @media (max-width: 768px) {
width: 60%;
 margin-bottom: 20px;
}
`;

const StyledFormLabel = styled(Form.Label)`
  margin-bottom: 5px;
`;

const StyledFormCheck = styled(Form.Check)`
  margin-bottom: 10px;
`;


const ProductsContainer = styled.div`
  flex: 1;
  padding: 20px;
`;

const HomePage = () => {
  // const [currentPage, setCurrentPage] = useState(1);
   const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0)
  const [limit, setLimit] = useState(200);
  const [total, setTotal] = useState(0);
// //   const [limit, setLimit] = useState(0);
  const [skip, setSkip] = useState(0);
  const [category, setCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { search } = useSelector((state) => state.search);

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    limit,
    skip: (currentPage - 1) * limit,
    search,
  });

  useEffect(() => {
    if (data?.products) {
      let filtered = [...data.products];

      // ✅ Apply category filter (ignore if 'all' is selected)
      if (category !== 'all') {
        filtered = filtered.filter((product) => product.category?.toLowerCase() === category.toLowerCase());
      }

      // ✅ Apply price range filter (products should match at least one selected price range)
      if (selectedPriceRange.length > 0) {
        filtered = filtered.filter((product) =>
          selectedPriceRange.some((price) => product.price <= price)
        );
      }

      // ✅ Apply brand filter (check if product.brand matches any selected brand)
      if (selectedBrands.length > 0) {
        filtered = filtered.filter((product) =>
          selectedBrands.includes(product.brand)
        );
      }

      setFilteredProducts(filtered);
    }
  }, [data, category, selectedPriceRange, selectedBrands]);

  const handlePriceChange = (e) => {
    const price = parseInt(e.target.value, 10);
    setSelectedPriceRange((prev) =>
      prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]
    );
  };

  useEffect(() => {
       if (data) {
         setLimit(200);
          setSkip((currentPage - 1) * limit);
          setTotal(data.total);
          setTotalPage(Math.ceil(total / limit));
         }
      }, [currentPage, data, limit, total, search]);

  const pageHandler = pageNum => {
       if (pageNum >= 1 && pageNum <= totalPage && pageNum !== currentPage) {
         setCurrentPage(pageNum);
        }
        };

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <>
          {!search && <ProductCarousel />}
          <Meta />
          <h2>Latest Products</h2>
          <Row>
            {data?.products?.slice(0, 4).map((product) => (
              <Col key={product._id} sm={12} md={6} lg={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>

          <h2 className="m-4">All Products</h2>
  <HomePageContainer>
            {/* Left Side Filters */}
   <FiltersContainer>
  <Heading>Filters</Heading>

  {/* ✅ Category Filter */}
  <StyledFormGroup>
    <StyledFormLabel>Select Category</StyledFormLabel> <br />
    <FormControl
      as="select"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    >
      <option value="all">All Categories</option>
      <option value="mens">Mens Footwear</option>
      <option value="womens">Womens Footwear</option>
      <option value="kids">Kids Footwear</option>
      <option value="sports">Sports Footwear</option>
    </FormControl>
  </StyledFormGroup>

  {/* ✅ Price Filter (Checkbox) */}
  <SubHeading>Price Range</SubHeading>
  <StyledFormGroup>
    {[500, 1000, 3000].map((price) => (
      <StyledFormCheck
        key={price}
        type="checkbox"
        label={`Up to ₹${price}`}
        value={price}
        checked={selectedPriceRange.includes(price)}
        onChange={handlePriceChange}
      />
    ))}
  </StyledFormGroup>

  {/* ✅ Brand Selection (Checkbox) */}
  <SubHeading>Brands</SubHeading>
  <StyledFormGroup>
    {['Puma', 'Nike', 'Adidas', 'Croma', 'Campus'].map((brand) => (
      <StyledFormCheck
        key={brand}
        type="checkbox"
        label={brand}
        value={brand}
        checked={selectedBrands.includes(brand)}
        onChange={handleBrandChange}
      />
    ))}
  </StyledFormGroup>
</FiltersContainer>
            {/* Right Side Products */}
            <ProductsContainer>
              <Row>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4}>
                      <Product product={product} />
                    </Col>
                  ))
                ) : (
                  <Message variant="info">No products found.</Message>
                )}
              </Row>

              {data?.totalPages > 1 && (
                 <Paginate
                 currentPage={currentPage}
                 totalPage={totalPage}
                 pageHandler={pageHandler}
               />
              )}
            </ProductsContainer>
          </HomePageContainer>
        </>
      )}
    </>
  );
};

export default HomePage;
