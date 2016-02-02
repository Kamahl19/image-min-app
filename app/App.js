import { ipcRenderer } from 'electron';

import React from 'react';
import Portal from 'react-portal';
import Dropzone from './components/Dropzone';
import CompareImages from './components/CompareImages';
import ImagesTable from './components/ImagesTable';

export default React.createClass({
    displayName: 'App',

    getInitialState() {
        return {
            imageQueue: [],
            compareImages: [],
        };
    },

    componentDidMount() {
        ipcRenderer.on('images.minified', this.onImageMinified);
    },

    componentWillUnmount() {
        ipcRenderer.off('images.minified', this.onImageMinified);
    },

    onFilesLoaded(filePath) {
        ipcRenderer.send('images.dropped', filePath);
    },

    onImageMinified(event, image) {
        if (image) {
            this.setState({
                imageQueue: this.state.imageQueue.concat(image)
            });
        }
    },

    openCompareImages(compareImages) {
        this.setState({ compareImages });
    },

    render() {
        let content;

        if (!this.state.imageQueue.length) {
            content = (
                <div className="bordered-area">
                    <span className="uk-text-bold">Drop your images here…</span>
                </div>
            );
        }
        else {
            content = (<ImagesTable imageQueue={this.state.imageQueue} openCompareImages={this.openCompareImages} />);
        }

        return (
            <div>
                <Dropzone onFilesLoaded={this.onFilesLoaded}>
                    <Portal className="portal" closeOnEsc closeOnOutsideClick isOpened={!!this.state.compareImages.length}>
                        <CompareImages images={this.state.compareImages} />
                    </Portal>

                    { content }
                </Dropzone>
                <div className="status-bar">
                    Optimizing… <img src="./imgs/spin.svg" />
                </div>
            </div>
        );
    }
});
