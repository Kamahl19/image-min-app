import React from 'react';

export default React.createClass({
    displayName: 'Dropzone',

    propTypes: {
        children: React.PropTypes.node,
        onFilesLoaded: React.PropTypes.func.isRequired,
    },

    onDrop(e) {
        this.stopAndPrevent(e);

        const files = e.dataTransfer.files;

        for (let i = 0; i < files.length; i++) {
            this.props.onFilesLoaded(files.item(i).path);
        }
    },

    stopAndPrevent(e) {
        e.stopPropagation();
        e.preventDefault();
    },

    render() {
        return (
            <div className="dropzone" onDragEnter={this.stopAndPrevent} onDragOver={this.stopAndPrevent} onDrop={this.onDrop}>
                { this.props.children }
            </div>
        );
    }
});
