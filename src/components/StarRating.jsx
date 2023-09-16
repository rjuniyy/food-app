import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const StarRating = ({ rating, maxStars, onRate }) => {
  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= maxStars; i++) {
      const isFilled = i <= rating;
      stars.push(
        <TouchableOpacity key={i} onPress={() => onRate(i)}>
          <Icon
            name={isFilled ? 'star' : 'star-o'}
            size={30}
            color={isFilled ? 'gold' : 'grey'}
          />
        </TouchableOpacity>,
      );
    }

    return stars;
  };

  return <View style={{ flexDirection: 'row' }}>{renderStars()}</View>;
};

export default StarRating;
