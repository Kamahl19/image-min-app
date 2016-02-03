import React from 'react';

export default React.createClass({
    displayName: 'StatusBar',

    propTypes: {
        imageQueue: React.PropTypes.array.isRequired,
    },

    getTotalSavedSpace() {
        let kb = 0;
        let percentage = 0;
        let optimizedCount = 0;

        for (const image of this.props.imageQueue) {
            if (image.newSize) {
                kb += image.origSize - image.newSize;
                percentage += +image.compressionRate;

                optimizedCount++;
            }
        }

        percentage = optimizedCount ? (percentage / optimizedCount).toFixed(4) * 100 : 0;

        return { kb, percentage };
    },

    render() {
        const totalSavedSpace = this.getTotalSavedSpace();

        return (
            <div className="status-bar">
                Total Saved Space: {totalSavedSpace.kb}kB ({totalSavedSpace.percentage}%)
            </div>
        );
    }
});
