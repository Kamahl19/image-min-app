import React from 'react';
import Table from 'react-uikit-table';
import ImagesTableRow from './ImagesTableRow';

export default React.createClass({
    displayName: 'ImagesTable',

    propTypes: {
        imageQueue: React.PropTypes.array.isRequired,
        openCompareImages: React.PropTypes.func.isRequired,
    },

    render() {
        return (
            <Table condensed hover striped head={['Name', 'Original Filesize', 'Optimized Filesize', 'Saved Space', 'Comparison']}>
                <tbody>
                    { this.props.imageQueue.map((image, key) =>
                        <ImagesTableRow image={image} key={key} openCompareImages={this.props.openCompareImages} />
                    ) }
                </tbody>
            </Table>
        );
    }
});
