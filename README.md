## react-native-carousel-loop

Typescript implementation of https://github.com/phil-r/react-native-looped-carousel with small fixes.

## Example usage

```tsx
import React, { Component } from 'react';
import { Text, View, Dimensions } from 'react-native';
import Carousel from 'react-native-looped-carousel';

const { width, height } = Dimensions.get('window');
const size = { width, height };
export default function Example() {
  const handleNextPage = (index: number) => {
    console.log(index);
  };
  return (
    <View style={{ flex: 1 }}>
      <Carousel delay={2000} style={size} autoplay pageInfo onAnimateNextPage={handleNextPage}>
        <View style={[{ backgroundColor: '#BADA55' }, size]}>
          <Text>1</Text>
        </View>
        <View style={[{ backgroundColor: 'red' }, size]}>
          <Text>2</Text>
        </View>
        <View style={[{ backgroundColor: 'blue' }, size]}>
          <Text>3</Text>
        </View>
      </Carousel>
    </View>
  );
}
```

### Props

```typescript
interface CarouselProps {
  autoplay?: boolean; // false
  delay?: number; // 4000
  currentPage?: number; // 0
  style?: ViewProps['style']; // undefined
  pageStyle?: ViewProps['style']; // undefined
  contentContainerStyle?: ViewProps['style']; // undefined
  pageInfo?: boolean; // false
  pageInfoBackgroundColor?: string; // rgba(0, 0, 0, 0.25)
  pageInfoTextStyle?: TextProps['style']; // undefined
  pageInfoBottomContainerStyle?: ViewProps['style']; // undefined
  pageInfoTextSeparator?: string; // ' / '
  bullets: boolean; // false
  bulletsContainerStyle?: TextProps['style']; // undefined
  bulletStyle?: TextProps['style']; // undefined
  arrows?: boolean; // false
  arrowsContainerStyle?: TextProps['style']; // undefined
  arrowStyle?: TextProps['style']; // undefined
  leftArrowStyle?: TextProps['style']; // undefined
  rightArrowStyle?: TextProps['style']; // undefined
  leftArrowText?: string; // undefined
  rightArrowText?: string; // undefined
  chosenBulletStyle?: TextProps['style']; // undefined
  onAnimateNextPage?: (index: number) => void; // undefined
  onPageBeingChanged?: (index: number) => void; // undefined
  swipe?: boolean; // true
  isLooped?: boolean; // true
}
```
