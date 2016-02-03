import { ipcRenderer } from 'electron';

import lodash from 'lodash';
import React from 'react';
import Portal from 'react-portal';
import StatusBar from './components/StatusBar';
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
        ipcRenderer.on('minification.started', this.onMinificationStarted);
        ipcRenderer.on('minification.finished', this.onMinificationFinished);
    },

    componentWillUnmount() {
        ipcRenderer.off('minification.started', this.onMinificationStarted);
        ipcRenderer.off('minification.finished', this.onMinificationFinished);
    },

    onFilesLoaded(filePath) {
        ipcRenderer.send('images.dropped', filePath);
    },

    onMinificationStarted(e, imageInfo) {
        if (imageInfo) {
            this.setState({
                imageQueue: this.state.imageQueue.concat(imageInfo)
            });
        }
    },

    onMinificationFinished(e, imageInfo) {
        if (imageInfo) {
            const imageQueue = this.state.imageQueue;

            lodash.find(this.state.imageQueue, (item, i) => {
                if (item.uid === imageInfo.uid) {
                    imageQueue[i] = imageInfo;
                    return true;
                }
            });

            this.setState({ imageQueue });
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
                <StatusBar imageQueue={this.state.imageQueue} />
            </div>
        );
    }
});
