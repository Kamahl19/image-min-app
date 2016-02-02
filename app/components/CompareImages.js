import React from 'react';

export default React.createClass({
    displayName: 'CompareImages',

    propTypes: {
        images: React.PropTypes.array.isRequired,
    },

    getInitialState() {
        return {
            sliderCss: {},
            leftImageCss: {},
            imgCss: {},
            enableMouseMoveListener: false,
        };
    },

    componentDidMount() {
        window.addEventListener('resize', this.initSlider);
    },

    componentWillUnmount() {
        window.removeEventListener('resize', this.initSlider);
    },

    onImgLoad(e) {
        this.imgWidth = e.target.naturalWidth;
        this.imgHeight = e.target.naturalHeight;

        this.initSlider();
    },

    initSlider() {
        if (!this.imgWidth || !this.imgHeight) {
            return;
        }

        let imgWidth;
        let imgHeight;
        let sliderWidth;
        let sliderHeight;

        const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        if (this.imgWidth >= this.imgHeight) {
            imgWidth = '90vw';
            imgHeight = 'auto';

            sliderWidth = '90vw';
            sliderHeight = Math.floor((1 - ((this.imgWidth - viewportWidth * 0.8) / this.imgWidth)) * this.imgHeight);
        }
        else {
            imgWidth = 'auto';
            imgHeight = '90vh';

            sliderWidth = Math.floor((1 - ((this.imgHeight - viewportHeight * 0.8) / this.imgHeight)) * this.imgWidth);
            sliderHeight = '90vh';
        }

        this.setState({
            imgCss: Object.assign({}, this.state.imgCss, {
                width: imgWidth,
                height: imgHeight,
            }),
            sliderCss: Object.assign({}, this.state.sliderCss, {
                width: sliderWidth,
                height: sliderHeight,
            }),
            leftImageCss: Object.assign({}, this.state.leftImageCss, {
                width: Math.floor(sliderWidth * 0.5),
                maxWidth: sliderWidth - 2,
            }),
        });
    },

    slideResize(e) {
        e.preventDefault();

        if (this.state.enableMouseMoveListener) {
            const width = (e.offsetX === undefined) ? e.pageX - e.currentTarget.offsetLeft : e.offsetX;

            this.setState({
                leftImageCss: Object.assign({}, this.state.leftImageCss, {
                    width
                })
            });
        }
    },

    enableSliderDrag(e) {
        e.preventDefault();

        this.setState({
            sliderCss: Object.assign({}, this.state.sliderCss, {
                cursor: 'ew-resize'
            }),
            enableMouseMoveListener: true,
        });
    },

    disableSliderDrag(e) {
        e.preventDefault();

        this.setState({
            sliderCss: Object.assign({}, this.state.sliderCss, {
                cursor: 'normal'
            }),
            enableMouseMoveListener: false,
        });
    },

    render() {
        return (
            <div className="slider"
                ref="slider"
                style={this.state.sliderCss}
                onMouseMove={this.slideResize}
                onMouseDown={this.enableSliderDrag}
                onMouseUp={this.disableSliderDrag}
            >
                <div className="left image" style={this.state.leftImageCss}>
                    <img src={this.props.images[0]} style={this.state.imgCss} onLoad={this.onImgLoad} />
                </div>
                <div className="right image">
                    <img src={this.props.images[1]} style={this.state.imgCss} />
                </div>
            </div>
        );
    }
});
