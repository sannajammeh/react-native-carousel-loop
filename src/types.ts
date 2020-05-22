import { Component, ReactNode } from 'react';
import { ViewProps, TextProps, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import * as CarouselMain from './index';

export interface CarouselProps {
  children: ReactNode;
  autoplay?: boolean;
  delay?: number;
  currentPage?: number;
  style?: ViewProps['style'];
  pageStyle?: ViewProps['style'];
  contentContainerStyle?: ViewProps['style'];
  pageInfo?: boolean;
  pageInfoBackgroundColor?: string;
  pageInfoTextStyle?: TextProps['style'];
  pageInfoBottomContainerStyle?: ViewProps['style'];
  pageInfoTextSeparator?: string;
  bullets: boolean;
  bulletsContainerStyle?: TextProps['style'];
  bulletStyle?: TextProps['style'];
  arrows?: boolean;
  arrowsContainerStyle?: TextProps['style'];
  arrowStyle?: TextProps['style'];
  leftArrowStyle?: TextProps['style'];
  rightArrowStyle?: TextProps['style'];
  leftArrowText?: string;
  rightArrowText?: string;
  chosenBulletStyle?: TextProps['style'];
  onAnimateNextPage?: (index: number) => void;
  onPageBeingChanged?: (index: number) => void;
  swipe?: boolean;
  isLooped?: boolean;
}

export interface StateProps {
  currentPage?: number;
  size: { width: number; height: number };
  childrenLength?: number;
  contents?: any;
}

export type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

export interface ScrollTo {
  offset: number;
  animated: boolean;
  nofix?: boolean;
}
