import React, { Component } from 'react';
import { Platform, StyleSheet, Text, ScrollView, TouchableOpacity, View, TouchableWithoutFeedback, } from 'react-native';
import isEqual from 'lodash.isequal';
const PAGE_CHANGE_DELAY = 4000;
/**
 * Animates pages in cycle
 * (loop possible if children count > 1)
 */
let Carousel = /** @class */ (() => {
    class Carousel extends Component {
        constructor(props) {
            super(props);
            this._setCurrentPage = (currentPage) => {
                this.setState({ currentPage }, () => {
                    if (this.props.onAnimateNextPage) {
                        // FIXME: called twice on ios with auto-scroll
                        this.props.onAnimateNextPage(currentPage);
                    }
                });
            };
            this._onScrollBegin = () => {
                this._clearTimer && this._clearTimer();
            };
            this._onScrollEnd = (event) => {
                const offset = Object.assign({}, event.nativeEvent.contentOffset);
                const page = this._calculateCurrentPage(offset.x);
                this._placeCritical(page);
                this._setCurrentPage(page);
                this._setUpTimer();
            };
            this._onScroll = (event) => {
                const currentOffset = event.nativeEvent.contentOffset.x;
                const direction = currentOffset > this.offset ? 'right' : 'left';
                this.offset = currentOffset;
                const nextPage = this._calculateNextPage(direction);
                if (this.nextPage !== nextPage) {
                    this.nextPage = nextPage;
                    if (this.props.onPageBeingChanged) {
                        this.props.onPageBeingChanged(this.nextPage);
                    }
                }
            };
            this._onLayout = (event) => {
                const { height, width } = event.nativeEvent.layout;
                this.setState({ size: { width, height } });
                // remove setTimeout wrapper when https://github.com/facebook/react-native/issues/6849 is resolved.
                this._placeCritical(this.state.currentPage);
                // setTimeout(() => this._placeCritical(this.state.currentPage as number), 0);
            };
            this._clearTimer = () => {
                this.timer && clearTimeout(this.timer);
            };
            this._setUpTimer = () => {
                // only for cycling
                if (this.props.autoplay && React.Children.count(this.props.children) > 1) {
                    this._clearTimer();
                    this.timer = setTimeout(this._animateNextPage, this.props.delay);
                }
            };
            this._scrollTo = ({ offset, animated, nofix }) => {
                if (this.scrollView) {
                    this.scrollView.scrollTo({ y: 0, x: offset, animated });
                    // Fix bug #50
                    if (!nofix && Platform.OS === 'android' && !animated) {
                        this.scrollView.scrollTo({ y: 0, x: offset, animated: true });
                    }
                }
            };
            this._animateNextPage = () => {
                const { currentPage } = this.state;
                const nextPage = this._normalizePageNumber(currentPage + 1);
                // prevent from looping
                if (!this.props.isLooped && nextPage < currentPage) {
                    return;
                }
                this.animateToPage(nextPage);
            };
            this._animatePreviousPage = () => {
                const { currentPage } = this.state;
                const nextPage = this._normalizePageNumber(currentPage - 1);
                // prevent from looping
                if (!this.props.isLooped && nextPage > currentPage) {
                    return;
                }
                this.animateToPage(nextPage);
            };
            this.animateToPage = (page) => {
                const { currentPage, childrenLength, size: { width }, } = this.state;
                const { isLooped } = this.props;
                const nextPage = this._normalizePageNumber(page);
                this._clearTimer();
                if (nextPage === currentPage) {
                    // pass
                }
                else if (nextPage === 0) {
                    if (isLooped) {
                        // animate properly based on direction
                        if (currentPage !== childrenLength - 1) {
                            this._scrollTo({
                                offset: (childrenLength + 2) * width,
                                animated: false,
                                nofix: true,
                            });
                        }
                        this._scrollTo({ offset: childrenLength * width, animated: true });
                    }
                    else {
                        this._scrollTo({ offset: 0, animated: true });
                    }
                }
                else if (nextPage === 1) {
                    // To properly animate from the first page we need to move view
                    // to its original position first (not needed if not looped)
                    if (currentPage === 0 && isLooped) {
                        this._scrollTo({ offset: 0, animated: false, nofix: true });
                    }
                    this._scrollTo({ offset: width, animated: true });
                }
                else {
                    // Last page is allowed to jump to the first through the "border"
                    if (currentPage === 0 && nextPage !== childrenLength - 1) {
                        this._scrollTo({ offset: 0, animated: false, nofix: true });
                    }
                    this._scrollTo({ offset: nextPage * width, animated: true });
                }
                this._setCurrentPage(nextPage);
                this._setUpTimer();
            };
            this._placeCritical = (page) => {
                const { isLooped } = this.props;
                const { childrenLength, size: { width }, } = this.state;
                let offset = 0;
                // if page number is bigger then length - something is incorrect
                if (page < childrenLength) {
                    if (page === 0 && isLooped) {
                        // in "looped" scenario first page shold be placed after the last one
                        offset = childrenLength * width;
                    }
                    else {
                        offset = page * width;
                    }
                }
                this._scrollTo({ offset, animated: false });
            };
            this._normalizePageNumber = (page) => {
                const { childrenLength } = this.state;
                if (page === childrenLength) {
                    return 0;
                }
                else if (page > childrenLength) {
                    return 1;
                }
                else if (page < 0) {
                    return childrenLength - 1;
                }
                return page;
            };
            this._calculateCurrentPage = (offset) => {
                const { width } = this.state.size;
                const page = Math.round(offset / width);
                return this._normalizePageNumber(page);
            };
            this._calculateNextPage = (direction) => {
                const { width } = this.state.size;
                const ratio = this.offset / width;
                const page = direction === 'right' ? Math.ceil(ratio) : Math.floor(ratio);
                return this._normalizePageNumber(page);
            };
            this._renderPageInfo = (pageLength) => (<View style={[styles.pageInfoBottomContainer, this.props.pageInfoBottomContainerStyle]} pointerEvents="none">
      <View style={styles.pageInfoContainer}>
        <View style={[styles.pageInfoPill, { backgroundColor: this.props.pageInfoBackgroundColor }]}>
          <Text style={[styles.pageInfoText, this.props.pageInfoTextStyle]}>
            {`${this.state.currentPage + 1}${this.props.pageInfoTextSeparator}${pageLength}`}
          </Text>
        </View>
      </View>
    </View>);
            this._renderBullets = (pageLength) => {
                const bullets = [];
                for (let i = 0; i < pageLength; i += 1) {
                    bullets.push(<TouchableWithoutFeedback onPress={() => this.animateToPage(i)} key={`bullet${i}`}>
          <View style={i === this.state.currentPage
                        ? [styles.chosenBullet, this.props.chosenBulletStyle]
                        : [styles.bullet, this.props.bulletStyle]}/>
        </TouchableWithoutFeedback>);
                }
                return (<View style={[styles.bullets, this.props.bulletsContainerStyle]} pointerEvents="box-none">
        {bullets}
      </View>);
            };
            this._renderArrows = () => {
                let { currentPage } = this.state;
                const { childrenLength } = this.state;
                if (currentPage < 1) {
                    currentPage = childrenLength;
                }
                return (<View style={styles.arrows} pointerEvents="box-none">
        <View style={[styles.arrowsContainer, this.props.arrowsContainerStyle]} pointerEvents="box-none">
          <TouchableOpacity onPress={this._animatePreviousPage} style={this.props.arrowStyle}>
            <Text style={this.props.leftArrowStyle}>
              {this.props.leftArrowText ? this.props.leftArrowText : 'Left'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._animateNextPage} style={this.props.arrowStyle}>
            <Text style={this.props.rightArrowStyle}>
              {this.props.rightArrowText ? this.props.rightArrowText : 'Right'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>);
            };
            const size = { width: 0, height: 0 };
            if (props.children) {
                const childrenLength = React.Children.count(props.children) || 1;
                this.state = {
                    currentPage: props.currentPage,
                    size,
                    childrenLength,
                    contents: null,
                };
            }
            else {
                this.state = { size };
            }
            this.offset = 0;
            this.nextPage = 0;
        }
        componentDidMount() {
            if (this.state.childrenLength) {
                this._setUpTimer();
            }
        }
        componentWillUnmount() {
            this._clearTimer && this._clearTimer();
        }
        componentDidUpdate({ children }) {
            if (!isEqual(this.props.children, children)) {
                const { currentPage } = this.state;
                this._clearTimer && this._clearTimer();
                let childrenLength = 0;
                if (children) {
                    childrenLength = React.Children.count(children) || 1;
                }
                const nextPage = currentPage >= childrenLength ? childrenLength - 1 : currentPage;
                this.setState({ childrenLength }, () => {
                    this.animateToPage(nextPage);
                    this._setUpTimer();
                });
            }
        }
        _setUpPages() {
            const { size } = this.state;
            const { children: propsChildren, isLooped, pageStyle } = this.props;
            const children = React.Children.toArray(propsChildren);
            const pages = [];
            if (children && children.length > 1) {
                // add all pages
                pages.push(...children);
                // We want to make infinite pages structure like this: 1-2-3-1-2
                // so we add first and second page again to the end
                if (isLooped) {
                    pages.push(children[0]);
                    pages.push(children[1]);
                }
            }
            else if (children) {
                pages.push(children[0]);
            }
            else {
                pages.push(<View>
          <Text>You are supposed to add children inside Carousel</Text>
        </View>);
            }
            return pages.map((page, i) => (<TouchableWithoutFeedback style={[Object.assign({}, size), pageStyle]} key={`page${i}`}>
        {page}
      </TouchableWithoutFeedback>));
        }
        getCurrentPage() {
            return this.state.currentPage;
        }
        render() {
            const contents = this._setUpPages();
            const { size, childrenLength } = this.state;
            return (<View onLayout={this._onLayout} style={[this.props.style]}>
        <ScrollView ref={(c) => {
                this.scrollView = c;
            }} onScrollBeginDrag={this._onScrollBegin} onMomentumScrollEnd={this._onScrollEnd} onScroll={this._onScroll} alwaysBounceHorizontal={false} alwaysBounceVertical={false} contentInset={{ top: 0 }} automaticallyAdjustContentInsets={false} showsHorizontalScrollIndicator={false} horizontal pagingEnabled bounces={false} scrollEnabled={this.props.swipe} contentContainerStyle={[
                styles.horizontalScroll,
                this.props.contentContainerStyle,
                {
                    width: size.width * (childrenLength + (childrenLength > 1 && this.props.isLooped ? 2 : 0)),
                    height: size.height,
                },
            ]}>
          {contents}
        </ScrollView>
        {this.props.arrows && this._renderArrows()}
        {this.props.bullets && this._renderBullets(childrenLength)}
        {this.props.pageInfo && this._renderPageInfo(childrenLength)}
      </View>);
        }
    }
    Carousel.defaultProps = {
        delay: PAGE_CHANGE_DELAY,
        autoplay: false,
        pageInfo: false,
        bullets: false,
        arrows: false,
        pageInfoBackgroundColor: 'rgba(0, 0, 0, 0.25)',
        pageInfoTextSeparator: ' / ',
        currentPage: 0,
        style: undefined,
        pageStyle: undefined,
        contentContainerStyle: undefined,
        pageInfoTextStyle: undefined,
        pageInfoBottomContainerStyle: undefined,
        bulletsContainerStyle: undefined,
        chosenBulletStyle: undefined,
        bulletStyle: undefined,
        arrowsContainerStyle: undefined,
        arrowStyle: undefined,
        leftArrowStyle: undefined,
        rightArrowStyle: undefined,
        leftArrowText: '',
        rightArrowText: '',
        onAnimateNextPage: undefined,
        onPageBeingChanged: undefined,
        swipe: true,
        isLooped: true,
    };
    return Carousel;
})();
const styles = StyleSheet.create({
    horizontalScroll: {
        position: 'absolute',
    },
    pageInfoBottomContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
    },
    pageInfoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    pageInfoPill: {
        width: 80,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageInfoText: {
        textAlign: 'center',
    },
    bullets: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 10,
        height: 30,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    arrows: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        backgroundColor: 'transparent',
    },
    arrowsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    chosenBullet: {
        margin: 10,
        width: 10,
        height: 10,
        borderRadius: 20,
        backgroundColor: 'white',
    },
    bullet: {
        margin: 10,
        width: 10,
        height: 10,
        borderRadius: 20,
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: 1,
    },
});
export default Carousel;
//# sourceMappingURL=index.js.map