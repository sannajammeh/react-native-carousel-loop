import { Component } from 'react';
import { ScrollView, LayoutChangeEvent } from 'react-native';
import { CarouselProps, StateProps, ScrollEvent, ScrollTo } from './types';
/**
 * Animates pages in cycle
 * (loop possible if children count > 1)
 */
declare class Carousel extends Component<CarouselProps, StateProps> {
    offset: number;
    nextPage: number;
    scrollView?: ScrollView | null;
    timer?: number;
    static defaultProps: {
        delay: number;
        autoplay: boolean;
        pageInfo: boolean;
        bullets: boolean;
        arrows: boolean;
        pageInfoBackgroundColor: string;
        pageInfoTextSeparator: string;
        currentPage: number;
        style: undefined;
        pageStyle: undefined;
        contentContainerStyle: undefined;
        pageInfoTextStyle: undefined;
        pageInfoBottomContainerStyle: undefined;
        bulletsContainerStyle: undefined;
        chosenBulletStyle: undefined;
        bulletStyle: undefined;
        arrowsContainerStyle: undefined;
        arrowStyle: undefined;
        leftArrowStyle: undefined;
        rightArrowStyle: undefined;
        leftArrowText: string;
        rightArrowText: string;
        onAnimateNextPage: undefined;
        onPageBeingChanged: undefined;
        swipe: boolean;
        isLooped: boolean;
    };
    constructor(props: CarouselProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate({ children }: CarouselProps): void;
    _setUpPages(): JSX.Element[];
    getCurrentPage(): number | undefined;
    _setCurrentPage: (currentPage: number) => void;
    _onScrollBegin: () => void;
    _onScrollEnd: (event: ScrollEvent) => void;
    _onScroll: (event: ScrollEvent) => void;
    _onLayout: (event: LayoutChangeEvent) => void;
    _clearTimer: () => void;
    _setUpTimer: () => void;
    _scrollTo: ({ offset, animated, nofix }: ScrollTo) => void;
    _animateNextPage: () => void;
    _animatePreviousPage: () => void;
    animateToPage: (page: number) => void;
    _placeCritical: (page: number) => void;
    _normalizePageNumber: (page: number) => number;
    _calculateCurrentPage: (offset: number) => number;
    _calculateNextPage: (direction: string) => number;
    _renderPageInfo: (pageLength: number) => JSX.Element;
    _renderBullets: (pageLength: number) => JSX.Element;
    _renderArrows: () => JSX.Element;
    render(): JSX.Element;
}
export default Carousel;
//# sourceMappingURL=index.d.ts.map