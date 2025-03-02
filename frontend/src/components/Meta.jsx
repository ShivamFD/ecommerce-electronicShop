import React from 'react';
import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: ' ShoeBiz | Buy Shoes Online',
  description:
    'Browse and buy the latest shoes  on our online store. Find great deals on Mens, Womens, and Kids FootWear. Fast shipping and secure payments.',
  keywords:
    'Casual, Sports, Mens, Womens, online shopping, Brands Shoe'
};

export default Meta;
