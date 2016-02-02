import React from 'react';
import Button from 'react-uikit-button';
import { truncString } from '../../electron/helpers';

export default React.createClass({
    displayName: 'ImagesTableRow',

    propTypes: {
        image: React.PropTypes.object.isRequired,
        openCompareImages: React.PropTypes.func.isRequired,
    },

    render() {
        const image = this.props.image;

        return (
            <tr>
                <td className="uk-text-left">{ truncString(image.name, 50) }</td>
                <td className="uk-text-left">{ image.origSize }kB</td>
                <td className="uk-text-left">{ image.newSize }kB</td>
                <td className="uk-text-left uk-text-success">{ image.compressionRate * 100 }%</td>
                <td className="uk-text-left">
                    <Button body="Open" context="primary" size="mini" onClick={this.props.openCompareImages.bind(null, [image.origPath, image.newPath])} />
                </td>
            </tr>
        );
    }
});
